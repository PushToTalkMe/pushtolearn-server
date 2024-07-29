import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LessonStat } from '../lessons/dto';

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

export class PatchSequence {
  @ApiProperty({ example: 5, type: Number })
  id: number;

  @ApiProperty({ example: 5, type: Number })
  sequence: number;
}

export class PatchSequences {
  @ApiProperty({ type: [PatchSequence] })
  patch: PatchSequence[];
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

export class SectionsWithLessonsStatDto {
  @ApiProperty({
    example: [
      { id: 1, title: 'Введение', type: 'Theory', viewed: true, sequence: 1 },
      {
        id: 2,
        title: 'Упражнение по HTML',
        type: 'Exercise',
        viewed: false,
        sequence: 2,
      },
      {
        id: 3,
        title: 'Тест по HTML',
        type: 'Test',
        viewed: false,
        sequence: 3,
      },
    ],
    type: [LessonStat],
  })
  lessonsStat: LessonStat[];

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
