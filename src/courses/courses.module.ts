import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/configs/jwt.config';
import { DbModule } from 'src/db/db.module';
import { AccountModule } from 'src/account/account.module';
import { MyCoursesService } from './my-courses.service';
import { SectionsModule } from '../sections/sections.module';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [
    DbModule,
    AccountModule,
    ConfigModule,
    SectionsModule,
    LessonsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, MyCoursesService],
  exports: [MyCoursesService],
})
export class CoursesModule {}
