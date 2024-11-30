import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateTestDto, PatchTestDto } from './dto';
import { DATA_TEST_INVALID, TEST_NOT_FOUND } from './constants';

@Injectable()
export class TestService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateTestDto) {
    if (!dto.questions) {
      throw new BadRequestException(DATA_TEST_INVALID);
    }
    return this.dbService.test.create({ data: dto });
  }

  async patch(lessonId: number, patch: PatchTestDto) {
    const test = await this.getTest(lessonId);
    if (!test) {
      throw new NotFoundException(TEST_NOT_FOUND);
    }
    return this.dbService.test.update({
      where: { lessonId },
      data: { ...patch },
    });
  }

  async delete(lessonId: number) {
    const test = await this.getTest(lessonId);
    if (!test) {
      throw new NotFoundException(TEST_NOT_FOUND);
    }
    return this.dbService.test.delete({ where: { lessonId } });
  }

  async getTest(lessonId: number) {
    return this.dbService.test.findFirst({
      where: { lessonId },
      select: {
        questions: true,
      },
    });
  }
}
