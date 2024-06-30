import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  title: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  courseId: number;
}

export class PatchSectionDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '5' })
  @IsNumber()
  @IsOptional()
  sequence?: number;
}

export class SectionDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'Введение' })
  title: string;

  @ApiProperty({ example: '1' })
  courseId: number;

  @ApiProperty({ example: '5' })
  sequence: number;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}

export class SectionsWithLessonsTitleDto {
  @ApiProperty({ example: 'Что такое NestJS' })
  lessonsTitle: string[];

  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'Введение' })
  title: string;

  @ApiProperty({ example: '2' })
  courseId: number;

  @ApiProperty({ example: '5' })
  sequence: number;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}
