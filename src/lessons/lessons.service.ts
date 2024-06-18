import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateLessonDto, PatchLessonDto } from './dto';
import { LESSON_NOT_FOUND } from '../courses/constants';

@Injectable()
export class LessonsService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateLessonDto) {
    return this.dbService.lesson.create({ data: dto });
  }

  async patchLesson(lessonId: number, patch: PatchLessonDto) {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) {
      throw new NotFoundException(LESSON_NOT_FOUND);
    }
    return this.dbService.lesson.update({
      where: { id: lessonId },
      data: { ...patch },
    });
  }

  async getLesson(lessonId: number) {
    return this.dbService.lesson.findFirst({
      where: { id: lessonId },
    });
  }

  async delete(lessonId: number) {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) {
      throw new NotFoundException(LESSON_NOT_FOUND);
    }
    return this.dbService.lesson.delete({ where: { id: lessonId } });
  }

  async getAllLessonsBySectionId(sectionId: number) {
    return this.dbService.lesson.findMany({
      where: { sectionId },
      orderBy: { sequence: 'asc' },
    });
  }

  async deleteAllLessonsBySectionId(sectionId: number) {
    return this.dbService.lesson.deleteMany({ where: { sectionId } });
  }

  async getAllLessonsIdBySectionId(sectionId: number) {
    const lessons = await this.getAllLessonsBySectionId(sectionId);
    return lessons.map((lesson) => lesson.id);
  }
}
