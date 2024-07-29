import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SectionDto, SectionsWithLessonsStatDto } from '../sections/dto';
import { Type } from 'class-transformer';
import { LessonDto, LessonsWithoutContent } from '../lessons/dto';

export class CreateCourseDto {
  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  title: string;

  @ApiProperty({ example: '7.5 часов' })
  @IsString()
  duration: string;

  @ApiProperty({
    example: ['Frontend', 'Backend', 'Fullstack'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 3999 })
  @IsNumber()
  price: number;
}

export class CreateCoursesDtoWithOwner extends CreateCourseDto {
  @ApiProperty({ example: 'ivan Ivanov' })
  @IsString()
  author: string;
}

export class CourseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'NextJS + NestJS' })
  title: string;

  @ApiProperty({ example: 'Vlad Ilyin' })
  author: string;

  @ApiProperty({ example: 'uri' })
  img: string;

  @ApiProperty({ example: '7.5 часов' })
  duration: string;

  @ApiProperty({
    example: ['JavaScript', 'Frontend', 'Backend'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({ example: 1 })
  price: number;

  @ApiProperty({ example: false })
  inDeveloping: boolean;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}

export class CourseDtoLastLessons extends CourseDto {
  @ApiProperty({ example: 1, type: Number })
  lastSectionId: number;

  @ApiProperty({ example: 1, type: Number })
  lastLessonId: number;
}

export class SectionWithLessons extends SectionDto {
  @ApiProperty({
    type: [LessonsWithoutContent],
  })
  lessons: LessonsWithoutContent[];
}

export class CourseWithSectionsForEdit extends CourseDto {
  @ApiProperty({
    type: [SectionWithLessons],
  })
  sectionsWithLessons: SectionWithLessons[];
}

export class CourseDtoWithSections extends CourseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        title: 'Введение',
        courseId: 1,
        sequence: 1,
        createdAt: '2024-07-01T10:23:15.094Z',
        updatedAt: '2024-07-01T10:23:15.094Z',
        lessonsStat: [
          { title: 'Введение', type: 'Theory', viewed: true },
          { title: 'Упражнение по HTML', type: 'Exercise', viewed: false },
          { title: 'Тест по HTML', type: 'Test', viewed: false },
        ],
      },
    ],
    type: [SectionsWithLessonsStatDto],
  })
  sectionsWithLessonsStat: SectionsWithLessonsStatDto[];

  @ApiProperty({ example: 1 })
  lessonCompleted: number;

  @ApiProperty({ example: 1 })
  lessonCount: number;

  @ApiProperty({ example: 1 })
  historySectionId: number;

  @ApiProperty({ example: 1 })
  historyLessonId: number;
}

export class CourseDtoWithLessonCount extends CourseDto {
  @ApiProperty({ example: 5 })
  lessonCount: number;
}

export class CourseDtoWithUserStat extends CourseDto {
  @ApiProperty({ example: 5 })
  lessonCount: number;

  @ApiProperty({ example: 1 })
  lessonCompleted: number;

  @ApiProperty({ example: 1 })
  historySectionId?: number;

  @ApiProperty({ example: 1 })
  historyLessonId?: number;
}

export class PatchCourseImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File;
}

export class PatchCourseDto {
  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '7.5 часов' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ example: ['Frontend', 'Backend', 'Fullstack'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 3999 })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export class ReleaseCourse {
  @ApiProperty({ example: false })
  @IsBoolean()
  isDeveloping: boolean;
}

export class PatchMyCourseStatDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  historySectionId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  historyLessonId?: number;
}

export class CreateUserStatLessonDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  viewed: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  lessonId: number;
}
