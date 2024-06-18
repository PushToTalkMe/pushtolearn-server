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
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Введение' })
  @IsString()
  title: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ example: '5' })
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  @IsDate()
  createdAt: Date;
}

export class SectionsWithLessonsTitleDto {
  @ApiProperty({ example: 'Что такое NestJS' })
  @IsArray()
  @IsString({ each: true })
  lessonsTitle: string[];

  @ApiProperty({ example: '1' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Введение' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ example: '5' })
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  @IsDate()
  createdAt: Date;
}
