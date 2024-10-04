import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
