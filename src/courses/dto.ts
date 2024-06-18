import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SectionsWithLessonsTitleDto } from '../sections/dto';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://imgs.ru/img#23124123' })
  @IsString()
  img: string;

  @ApiProperty({ example: '7.5 часов' })
  @IsString()
  duration: string;

  @ApiProperty({ example: ['Frontend', 'Backend', 'Fullstack'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 3999 })
  @IsNumber()
  price: number;
}

export class CreateCoursesDtoWithOwner extends CreateCourseDto {
  @IsString()
  author: string;
}

export class CourseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  title: 'Основы JavaScript';

  @ApiProperty({ example: 'Vlad Ilyin' })
  @IsString()
  author: ' ';

  @ApiProperty({ example: 'uri' })
  @IsString()
  img: 'uri';

  @ApiProperty({ example: '7.5 часов' })
  @IsString()
  duration: '7.5 часов';

  @ApiProperty({ example: ['JavaScript', 'Frontend', 'Backend'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  @IsDate()
  createdAt: Date;
}

export class CourseDtoWithSections extends CourseDto {
  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  @IsArray()
  @Type(() => SectionsWithLessonsTitleDto)
  sectionsWithLessonsTitle: SectionsWithLessonsTitleDto[];
}

export class PatchCourseDto {
  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'https://imgs.ru/img#23124123' })
  @IsString()
  @IsOptional()
  img?: string;

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

  @ApiProperty({ example: '5' })
  @IsNumber()
  @IsOptional()
  sequence?: number;
}
