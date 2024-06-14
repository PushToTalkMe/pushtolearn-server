import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateSectionBodyDto, PatchSectionDto } from './dto';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class SectionsService {
  constructor(
    private readonly dbService: DbService,
    private readonly lessonsService: LessonsService,
  ) {}

  async create(dto: CreateSectionBodyDto) {
    return this.dbService.section.create({ data: dto });
  }

  async patchSection(sectionId: number, patch: PatchSectionDto) {
    return this.dbService.section.update({
      where: { id: sectionId },
      data: { ...patch },
    });
  }

  async getSectionBySectionId(sectionId: number) {
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

  async getAllLessonsTitleBySectionId(sectionId: number) {
    const lessons =
      await this.lessonsService.getAllLessonsBySectionId(sectionId);
    const lessonsTitle = lessons.map((lesson) => lesson.title);
    return lessonsTitle;
  }
}
