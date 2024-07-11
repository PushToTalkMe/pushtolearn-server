import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateLessonDto, PatchLessonDto } from './dto';
import {
  COURSE_NOT_FOUND,
  LESSON_NOT_FOUND,
  SECTION_NOT_FOUND,
} from '../courses/constants';
import { TheoryService } from '../theory/theory.service';
import { TestService } from '../test/test.service';
import { ExerciseService } from '../exercise/exercise.service';
import { EXERCISE, LESSON_TYPE_INVALID, TEST, THEORY } from './constants';

@Injectable()
export class LessonsService {
  constructor(
    private readonly dbService: DbService,
    private readonly theoryService: TheoryService,
    private readonly testService: TestService,
    private readonly exerciseService: ExerciseService,
  ) {}

  async create(dto: CreateLessonDto) {
    return await this.dbService.$transaction(async () => {
      const section = await this.dbService.section.findFirst({
        where: { id: dto.sectionId },
      });
      if (!section) {
        throw new NotFoundException(SECTION_NOT_FOUND);
      }
      const { data, ...newDto } = dto;

      const maxSequence = await this.dbService.lesson.findMany({
        where: { sectionId: section.id },
        orderBy: { sequence: 'desc' },
        take: 1,
      });
      const nextSequence =
        maxSequence.length > 0 ? maxSequence[0].sequence + 1 : 1;

      const lesson = await this.dbService.lesson.create({
        data: { ...newDto, sequence: nextSequence },
      });
      let item;
      switch (lesson.type) {
        case THEORY:
          item = await this.theoryService.create({
            content: data.content,
            lessonId: lesson.id,
          });
          break;
        case TEST:
          item = await this.testService.create({
            questions: data.questions,
            lessonId: lesson.id,
          });
          break;
        case EXERCISE:
          item = await this.exerciseService.create({
            tasks: data.tasks,
            lessonId: lesson.id,
          });
          break;
        default:
          throw new BadRequestException(LESSON_TYPE_INVALID);
      }
      const userIds = await this.dbService.myCourse.findMany({
        where: { courseId: section.courseId },
        select: { userId: true },
      });
      if (!userIds) {
        throw new NotFoundException(COURSE_NOT_FOUND);
      }
      await Promise.all(
        userIds.map(async ({ userId }) => {
          await this.dbService.userStatLesson.create({
            data: { lessonId: lesson.id, userId, viewed: false },
          });
        }),
      );
      return { ...lesson, data: item };
    });
  }

  async patchLesson(lessonId: number, patch: PatchLessonDto) {
    await this.getLesson(lessonId);
    return await this.dbService.$transaction(async () => {
      const { data, ...newPatch } = patch;
      const lesson = await this.dbService.lesson.update({
        where: { id: lessonId },
        data: newPatch,
      });
      let item;
      switch (lesson.type) {
        case THEORY:
          item = await this.theoryService.patch(lessonId, data);
          break;
        case TEST:
          item = await this.testService.patch(lessonId, data);
          break;
        case EXERCISE:
          item = await this.exerciseService.patch(lessonId, data);
          break;
        default:
          throw new BadRequestException(LESSON_TYPE_INVALID);
      }
      return { ...lesson, data: item };
    });
  }

  async getLesson(lessonId: number) {
    return await this.dbService.$transaction(async () => {
      const lesson = await this.dbService.lesson.findFirst({
        where: { id: lessonId },
      });
      if (!lesson) {
        throw new NotFoundException(LESSON_NOT_FOUND);
      }
      let item;
      switch (lesson.type) {
        case THEORY:
          item = await this.theoryService.getTheory(lessonId);
          break;
        case TEST:
          item = await this.testService.getTest(lessonId);
          break;
        case EXERCISE:
          item = await this.exerciseService.getExercise(lessonId);
          break;
        default:
          throw new BadRequestException(LESSON_TYPE_INVALID);
      }
      return { ...lesson, data: item };
    });
  }

  async delete(lessonId: number) {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) {
      throw new NotFoundException(LESSON_NOT_FOUND);
    }
    return await this.dbService.$transaction(async () => {
      switch (lesson.type) {
        case THEORY:
          await this.theoryService.delete(lessonId);
          break;
        case TEST:
          await this.testService.delete(lessonId);
          break;
        case EXERCISE:
          await this.exerciseService.delete(lessonId);
          break;
        default:
          throw new BadRequestException(LESSON_TYPE_INVALID);
      }
      await this.dbService.userStatLesson.deleteMany({ where: { lessonId } });
      return this.dbService.lesson.delete({ where: { id: lessonId } });
    });
  }

  async getAllLessonsBySectionId(sectionId: number) {
    return this.dbService.lesson.findMany({
      where: { sectionId },
      orderBy: { sequence: 'asc' },
    });
  }

  async deleteAllLessonsBySectionId(sectionId: number) {
    const lessons = await this.getAllLessonsBySectionId(sectionId);
    await Promise.all(
      lessons.map(async (lesson) => {
        await this.dbService.userStatLesson.deleteMany({
          where: { lessonId: lesson.id },
        });
        switch (lesson.type) {
          case THEORY:
            await this.theoryService.delete(lesson.id);
            break;
          case TEST:
            await this.testService.delete(lesson.id);
            break;
          case EXERCISE:
            await this.exerciseService.delete(lesson.id);
            break;
          default:
            throw new BadRequestException(LESSON_TYPE_INVALID);
        }
      }),
    );
    return this.dbService.lesson.deleteMany({ where: { sectionId } });
  }

  async getAllLessonsIdBySectionId(sectionId: number) {
    const lessons = await this.getAllLessonsBySectionId(sectionId);
    return lessons.map((lesson) => lesson.id);
  }
}
