import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { DbModule } from '../db/db.module';
import { AccountModule } from '../account/account.module';
import { MyCoursesService } from './my-courses.service';
import { SectionsModule } from '../sections/sections.module';
import { LessonsModule } from '../lessons/lessons.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    DbModule,
    AccountModule,
    ConfigModule,
    SectionsModule,
    LessonsModule,
    FilesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, MyCoursesService],
  exports: [CoursesService, MyCoursesService],
})
export class CoursesModule {}
