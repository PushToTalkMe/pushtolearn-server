import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  CreateSectionDto,
  PatchSectionDto,
  PatchSequence,
  PatchSequences,
} from './dto';
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

  async patchSequences(patch: PatchSequences) {
    return await Promise.all(
      patch.patch.map(
        async (section) =>
          await this.dbService.section.update({
            where: { id: section.id },
            data: { sequence: section.sequence },
          }),
      ),
    );
  }

  async delete(sectionId: number) {
    const section = await this.getSection(sectionId);
    if (!section) {
      throw new NotFoundException(SECTION_NOT_FOUND);
    }
    return this.dbService.$transaction(async () => {
      const defaultIds = { sectionId: 0, lessonId: 0 };
      const sectionForDelete = await this.dbService.section.findFirst({
        where: { id: sectionId },
      });
      const sections = (
        await this.getAllSectionsByCourseId(section.courseId)
      ).filter((section) => section.id !== sectionId);
      let lessons = [];
      if (sections.length > 0) {
        lessons = await this.lessonsService.getAllLessonsBySectionId(
          sections[0].id,
        );
      }
      const userIds = await this.dbService.myCourse.findMany({
        where: { courseId: sectionForDelete.courseId },
        select: { userId: true },
      });
      if (!userIds) {
        await this.lessonsService.deleteAllLessonsBySectionId(sectionId);
        return await this.dbService.section.delete({
          where: { id: sectionId },
        });
      }
      await Promise.all(
        userIds.map(async ({ userId }) => {
          const { id } = await this.dbService.myCourse.findFirst({
            where: { userId, courseId: sectionForDelete.courseId },
          });
          if (lessons.length > 0) {
            await this.dbService.myCourse.update({
              where: { id },
              data: {
                historyLessonId: lessons[0].id,
                historySectionId: sections[0].id,
              },
            });
          } else {
            await this.dbService.myCourse.update({
              where: { id },
              data: {
                historyLessonId: defaultIds.lessonId,
                historySectionId: defaultIds.sectionId,
              },
            });
          }
        }),
      );
      await this.lessonsService.deleteAllLessonsBySectionId(sectionId);
      return await this.dbService.section.delete({
        where: { id: sectionId },
      });
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

  async getAllLessonsStatBySectionId(sectionId: number, userId: number) {
    const lessons =
      await this.lessonsService.getAllLessonsBySectionId(sectionId);
    const lessonsStat = await Promise.all(
      lessons.map(async (lesson) => {
        const userStatLesson = await this.dbService.userStatLesson.findFirst({
          where: { lessonId: lesson.id, userId },
        });
        if (!userStatLesson) {
          throw new NotFoundException();
        }
        const viewed = userStatLesson.viewed;
        return {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          viewed,
          sequence: lesson.sequence,
        };
      }),
    );
    return lessonsStat;
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
