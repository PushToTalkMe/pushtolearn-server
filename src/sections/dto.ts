import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LessonTitleAndType } from '../lessons/dto';

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

export class SectionsWithLessonsTitleAndTypeDto {
  @ApiProperty({
    example: [
      { title: 'Введение', type: 'Theory' },
      { title: 'Упражнение по HTML', type: 'Exercise' },
      { title: 'Тест по HTML', type: 'Test' },
    ],
  })
  lessonsTitleAndType: LessonTitleAndType[];

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
