import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCoursesBodyDtoWithOwner, PatchCourseDto } from './dto';
import { MyCoursesService } from './my-courses.service';
import {
  ANY_COURSE_NOT_PURCHASED,
  ANY_COURSE_PURCHASED,
  COURSE_NOT_FOUND,
  COURSE_NOT_PURCHASED,
} from './constants';
import { SectionsService } from '../sections/sections.service';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly dbService: DbService,
    private readonly myCoursesService: MyCoursesService,
    private readonly sectionsService: SectionsService,
    private readonly lessonsService: LessonsService,
  ) {}
  async create(dto: CreateCoursesBodyDtoWithOwner, userId: number) {
    return this.dbService.$transaction(async () => {
      const course = await this.dbService.course.create({
        data: dto,
      });
      await this.myCoursesService.addCourse(userId, course.id);
      return course;
    });
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

  async getCourseById(courseId: number, userId: number) {
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

  async getAllCourses(userId: number) {
    const notMyCourses = this.myCoursesService.getNotMyCourses(userId);
    if (!notMyCourses) {
      throw new BadRequestException(ANY_COURSE_PURCHASED);
    }
    return notMyCourses;
  }
}
