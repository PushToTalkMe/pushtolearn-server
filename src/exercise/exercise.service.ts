import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateExerciseDto, PatchExerciseDto } from './dto';
import { DATA_EXERCISE_INVALID, EXERCISE_NOT_FOUND } from './constants';

@Injectable()
export class ExerciseService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateExerciseDto) {
    if (!dto.tasks) {
      throw new BadRequestException(DATA_EXERCISE_INVALID);
    }
    return this.dbService.exercise.create({ data: dto });
  }

  async patch(lessonId: number, patch: PatchExerciseDto) {
    const exercise = await this.getExercise(lessonId);
    if (!exercise) {
      throw new NotFoundException(EXERCISE_NOT_FOUND);
    }
    return this.dbService.exercise.update({
      where: { lessonId },
      data: { ...patch },
    });
  }

  async delete(lessonId: number) {
    const exercise = await this.getExercise(lessonId);
    if (!exercise) {
      throw new NotFoundException(EXERCISE_NOT_FOUND);
    }
    return this.dbService.exercise.delete({ where: { lessonId } });
  }

  async getExercise(lessonId: number) {
    return this.dbService.exercise.findFirst({
      where: { lessonId },
    });
  }
}
