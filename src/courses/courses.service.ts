import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  CreateCoursesDtoWithOwner,
  PatchCourseDto,
  PatchCourseImageDto,
  ReleaseCourse,
} from './dto';
import { MyCoursesService } from './my-courses.service';
import {
  ANY_COURSE_NOT_PURCHASED,
  ANY_COURSE_PURCHASED,
  COURSE_NOT_FOUND,
  COURSE_NOT_PURCHASED,
  COURSE_PURCHASED,
  LESSON_NOT_FOUND,
  LESSON_NOT_FOUND_FOR_RELEASE,
  SECTION_NOT_FOUND,
  SECTION_NOT_FOUND_FOR_RELEASE,
} from './constants';
import * as fs from 'fs';
import * as path from 'path';
import { SectionsService } from '../sections/sections.service';
import { LessonsService } from '../lessons/lessons.service';
import { IFile } from './image.class';
import { FilesService } from '../files/files.service';
import { Response } from 'express';

@Injectable()
export class CoursesService {
  constructor(
    private readonly dbService: DbService,
    private readonly myCoursesService: MyCoursesService,
    private readonly sectionsService: SectionsService,
    private readonly lessonsService: LessonsService,
    private readonly filesService: FilesService,
  ) {}
  async create(dto: CreateCoursesDtoWithOwner) {
    const course = await this.dbService.course.create({
      data: {
        ...dto,
        img: '',
        inDeveloping: true,
      },
    });
    const section = await this.sectionsService.create({
      title: 'Первый раздел',
      courseId: course.id,
    });
    const lesson = await this.lessonsService.create({
      title: 'Первый урок',
      data: { content: '**Пример текста**' },
      type: 'Theory',
      sectionId: section.id,
    });
    return { ...course, lastSectionId: section.id, lastLessonId: lesson.id };
  }

  async uploadImage(file: Express.Multer.File, courseId: number) {
    let saveFile: IFile = new IFile(file);
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer);
      const originalname = `${file.size}${courseId}${Math.floor(Math.random() * Math.random() * 1000)}`;
      saveFile = new IFile({
        originalname: `${originalname.split('.')[0]}.webp`,
        buffer,
      });
    }
    return this.filesService.saveFiles(saveFile, `courses/${courseId}`);
  }

  async getImage(url: string, res: Response) {
    const response = fs.createReadStream(path.resolve(`./uploads/${url}`));
    response.pipe(res);
  }

  async patchCourse(courseId: number, patch: PatchCourseDto) {
    const course = await this.getCourse(courseId);
    if (!course) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }

    return this.dbService.course.update({
      where: { id: courseId },
      data: { ...patch },
    });
  }

  async releaseCourse(courseId: number) {
    const course = await this.getCourse(courseId);
    if (!course) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }
    const sections =
      await this.sectionsService.getAllSectionsByCourseId(courseId);
    if (sections.length <= 0) {
      throw new NotFoundException(SECTION_NOT_FOUND_FOR_RELEASE);
    }
    const lessons = await Promise.all(
      sections.map(
        async (section) =>
          await this.lessonsService.getAllLessonsBySectionId(section.id),
      ),
    );
    if (lessons.length <= 0) {
      throw new NotFoundException(LESSON_NOT_FOUND_FOR_RELEASE);
    }
    return this.dbService.course.update({
      where: { id: courseId },
      data: { inDeveloping: false },
    });
  }

  async patchCourseImage(courseId: number, file: Express.Multer.File) {
    const course = await this.getCourse(courseId);
    if (!course) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }
    const { url } = await this.uploadImage(file, courseId);
    return this.dbService.course.update({
      where: { id: courseId },
      data: { img: url },
    });
  }

  async getCourse(courseId: number) {
    return this.dbService.course.findFirst({
      where: { id: courseId },
    });
  }

  async delete(courseId: number) {
    const course = await this.getCourse(courseId);
    if (!course) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }
    return this.dbService.$transaction(async () => {
      const sectionsId =
        await this.sectionsService.getAllSectionsIdByCourseId(courseId);
      await Promise.all(
        sectionsId.map(async (sectionId) =>
          this.lessonsService.deleteAllLessonsBySectionId(sectionId),
        ),
      );
      await this.sectionsService.deleteAllSectionsByCourseId(courseId);
      await this.myCoursesService.deleteMyCoursesByCourseId(courseId);
      return this.dbService.course.delete({
        where: { id: courseId },
      });
    });
  }

  async getCourseFromMy(courseId: number, userId: number) {
    const myCourses = await this.myCoursesService.getMyCourses(userId);
    if (!myCourses) {
      throw new BadRequestException(ANY_COURSE_NOT_PURCHASED);
    }
    const myCourse = myCourses.find((course) => course.id === courseId);
    if (!myCourse) {
      throw new BadRequestException(COURSE_NOT_PURCHASED);
    }
    return myCourse;
  }

  async getAllCourses() {
    const allCourses = await this.dbService.course.findMany({
      orderBy: [{ inDeveloping: 'asc' }, { updatedAt: 'desc' }],
    });
    if (!allCourses) {
      throw new BadRequestException(COURSE_NOT_FOUND);
    }

    const allCoursesLastlessons = await Promise.all(
      allCourses.map(async (course) => {
        let lastSectionId = 0;
        let lastLessonId = 0;
        const sectionsId = await this.dbService.section.findMany({
          where: { courseId: course.id },
          orderBy: { sequence: 'asc' },
          select: { id: true, sequence: true },
        });
        const lessonsId = await Promise.all(
          sectionsId.map(async (section) => {
            const lesson = await this.dbService.lesson.findFirst({
              where: { sectionId: section.id },
              orderBy: { sequence: 'asc' },
              take: 1,
              select: { id: true, sequence: true },
            });
            if (lesson) {
              return {
                sectionId: section.id,
                sectionSequence: section.sequence,
                lessonId: lesson.id,
                lessonSequence: lesson.sequence,
              };
            } else {
              return;
            }
          }),
        );
        const result = lessonsId.filter((lesson) => lesson !== undefined);
        let min = result[0].sectionSequence;
        let index = 0;
        for (let i = 1; i < result.length; i++) {
          if (result[i].sectionSequence < min) {
            min = result[i].sectionSequence;
            index = i;
          }
        }
        return {
          ...course,
          lastSectionId: result[index].sectionId,
          lastLessonId: result[index].lessonId,
        };
      }),
    );
    return allCoursesLastlessons;
  }

  async getCourseFromNotMy(courseId: number, userId: number) {
    const notMyCourses = await this.getAllCoursesFromNotMy(userId);
    const notMyCourse = notMyCourses.find((course) => course.id === courseId);
    if (!notMyCourse) {
      throw new BadRequestException(
        COURSE_NOT_FOUND + ' или ' + COURSE_PURCHASED,
      );
    }
    return notMyCourse;
  }

  async getAllCoursesFromNotMy(userId: number) {
    const notMyCourses = this.myCoursesService.getNotMyCourses(userId);
    if (!notMyCourses) {
      throw new BadRequestException(ANY_COURSE_PURCHASED);
    }
    return notMyCourses;
  }
}
