import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateSectionDto, PatchSectionDto } from './dto';
import { LessonsService } from '../lessons/lessons.service';
import { SECTION_NOT_FOUND } from '../courses/constants';

@Injectable()
export class SectionsService {
  constructor(
    private readonly dbService: DbService,
    private readonly lessonsService: LessonsService,
  ) {}

  async create(dto: CreateSectionDto) {
    return this.dbService.section.create({ data: dto });
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

  async getAllLessonsTitleBySectionId(sectionId: number) {
    const lessons =
      await this.lessonsService.getAllLessonsBySectionId(sectionId);
    const lessonsTitle = lessons.map((lesson) => lesson.title);
    return lessonsTitle;
  }
}
