import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
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

  async delete(sectionId: number) {
    return this.dbService.section.delete({ where: { id: sectionId } });
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

  async getAllLessonsTitleBySectionId(sectionId: number) {
    const lessons =
      await this.lessonsService.getAllLessonsBySectionId(sectionId);
    const lessonsTitle = lessons.map((lesson) => lesson.title);
    return lessonsTitle;
  }
}
