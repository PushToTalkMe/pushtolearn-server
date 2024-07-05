import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateTheoryDto, PatchTheoryDto } from './dto';
import { DATA_THEORY_INVALID, THEORY_NOT_FOUND } from './constants';

@Injectable()
export class TheoryService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateTheoryDto) {
    if (!dto.content) {
      throw new BadRequestException(DATA_THEORY_INVALID);
    }
    return this.dbService.theory.create({ data: dto });
  }

  async patch(lessonId: number, patch: PatchTheoryDto) {
    const theory = await this.getTheory(lessonId);
    if (!theory) {
      throw new NotFoundException(THEORY_NOT_FOUND);
    }
    return this.dbService.theory.update({
      where: { lessonId },
      data: { ...patch },
    });
  }

  async delete(lessonId: number) {
    const theory = await this.getTheory(lessonId);
    if (!theory) {
      throw new NotFoundException(THEORY_NOT_FOUND);
    }
    return this.dbService.theory.delete({ where: { lessonId } });
  }

  async getTheory(lessonId: number) {
    return this.dbService.theory.findFirst({
      where: { lessonId },
      select: {
        content: true,
      },
    });
  }
}
