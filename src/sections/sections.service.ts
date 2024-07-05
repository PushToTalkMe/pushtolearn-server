import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateSectionDto, PatchSectionDto } from './dto';
import { LessonsService } from '../lessons/lessons.service';
import { COURSE_NOT_FOUND, SECTION_NOT_FOUND } from '../courses/constants';

@Injectable()
export class SectionsService {
  constructor(
    private readonly dbService: DbService,
    private readonly lessonsService: LessonsService,
  ) {}

  async create(dto: CreateSectionDto) {
    const course = await this.dbService.course.findFirst({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }
    const maxSequence = await this.dbService.section.findMany({
      where: { courseId: course.id },
      orderBy: { sequence: 'desc' },
      take: 1,
    });

    const nextSequence =
      maxSequence.length > 0 ? maxSequence[0].sequence + 1 : 1;
    return this.dbService.section.create({
      data: { ...dto, sequence: nextSequence },
    });
  }

  async patchSection(sectionId: number, patch: PatchSectionDto) {
    const section = await this.getSection(sectionId);
    if (!section) {
      throw new NotFoundException(SECTION_NOT_FOUND);
    }
    return this.dbService.section.update({
      where: { id: sectionId },
      data: { ...patch },
    });
  }

  async delete(sectionId: number) {
    const section = await this.getSection(sectionId);
    if (!section) {
      throw new NotFoundException(SECTION_NOT_FOUND);
    }
    return this.dbService.$transaction(async () => {
      await this.lessonsService.deleteAllLessonsBySectionId(sectionId);
      return this.dbService.section.delete({ where: { id: sectionId } });
    });
  }

  async getSection(sectionId: number) {
    return this.dbService.section.findFirst({
      where: { id: sectionId },
    });
  }

  async getAllSectionsByCourseId(courseId: number) {
    return this.dbService.section.findMany({
      where: { courseId },
      orderBy: { sequence: 'asc' },
    });
  }

  async getAllSectionsIdByCourseId(courseId: number) {
    const sections = await this.getAllSectionsByCourseId(courseId);
    return sections.map((section) => section.id);
  }

  async deleteAllSectionsByCourseId(courseId: number) {
    return this.dbService.section.deleteMany({
      where: {
        courseId,
      },
    });
  }

  async getAllLessonsTitleAndTypeAndViewedBySectionId(
    sectionId: number,
    userId: number,
  ) {
    const lessons =
      await this.lessonsService.getAllLessonsBySectionId(sectionId);
    const lessonsTitleAndTypeAndViewed = await Promise.all(
      lessons.map(async (lesson) => {
        const { viewed } = await this.dbService.userStatLesson.findFirst({
          where: { lessonId: lesson.id, userId },
        });
        return { title: lesson.title, type: lesson.type, viewed };
      }),
    );
    return lessonsTitleAndTypeAndViewed;
  }

  async getAllSectionsWithLessons(sectionId: number) {
    const lessons =
      await this.lessonsService.getAllLessonsBySectionId(sectionId);
    const lessonsTitleAndType = lessons.map(async (lesson) => {
      return { title: lesson.title, type: lesson.type };
    });
    return lessonsTitleAndType;
  }
}
