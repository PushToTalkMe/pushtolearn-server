import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateLessonBodyDto, PatchLessonDto } from './dto';

@Injectable()
export class LessonsService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateLessonBodyDto) {
    return this.dbService.lesson.create({ data: dto });
  }

  async patchLesson(lessonId: number, patch: PatchLessonDto) {
    return this.dbService.lesson.update({
      where: { id: lessonId },
      data: { ...patch },
    });
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

  async getLessonByLessonId(lessonId: number) {
    return this.dbService.lesson.findFirst({
      where: { id: lessonId },
    });
  }
}
