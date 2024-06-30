import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { DbModule } from '../db/db.module';
import { LessonsController } from './lessons.controller';
import { TheoryModule } from '../theory/theory.module';
import { TestModule } from '../test/test.module';
import { ExerciseModule } from '../exercise/exercise.module';

@Module({
  imports: [
    DbModule,
    ConfigModule,
    TheoryModule,
    TestModule,
    ExerciseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [LessonsService],
  exports: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
