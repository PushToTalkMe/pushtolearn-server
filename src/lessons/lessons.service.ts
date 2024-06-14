import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
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

  async getLessonByLessonId(lessonId: number) {
    return this.dbService.lesson.findFirst({
      where: { id: lessonId },
    });
  }
}
