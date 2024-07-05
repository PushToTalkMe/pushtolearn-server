import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExerciseDto, PatchExerciseDto } from '../exercise/dto';
import { PatchTestDto, TestDto } from '../test/dto';
import { PatchTheoryDto, TheoryDto } from '../theory/dto';

export class CreateLessonDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  title: string;

  @ApiProperty({ example: { content: '##Введение' } })
  data: PatchTestDto & PatchExerciseDto & PatchTheoryDto;

  @ApiProperty({
    enum: [
      $Enums.LessonType.Theory,
      $Enums.LessonType.Test,
      $Enums.LessonType.Exercise,
    ],
  })
  @IsIn([
    $Enums.LessonType.Theory,
    $Enums.LessonType.Test,
    $Enums.LessonType.Exercise,
  ])
  type: $Enums.LessonType;

  @ApiProperty({ example: 5 })
  @IsNumber()
  sectionId: number;
}

export class PatchLessonDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: { content: '##Введение' } })
  @IsOptional()
  data?: PatchTestDto & PatchExerciseDto & PatchTheoryDto;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  sequence?: number;
}

export class LessonDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 1 })
  sectionId: number;

  @ApiProperty({ example: 2 })
  sequence: number;

  @ApiProperty({ example: 'Что такое NestJS' })
  title: string;

  @ApiProperty({ example: { content: '##Введение' } })
  data: TestDto & ExerciseDto & TheoryDto;

  @ApiProperty({
    enum: [
      $Enums.LessonType.Theory,
      $Enums.LessonType.Test,
      $Enums.LessonType.Exercise,
    ],
  })
  type: $Enums.LessonType;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}

export class LessonDtoWithViewed extends LessonDto {
  @ApiProperty({ example: false })
  viewed: boolean;
}

export class LessonStat {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'Что такое NestJS' })
  title: string;

  @ApiProperty({
    enum: [
      $Enums.LessonType.Theory,
      $Enums.LessonType.Test,
      $Enums.LessonType.Exercise,
    ],
  })
  type: $Enums.LessonType;

  @ApiProperty({ example: true })
  viewed: boolean;

  @ApiProperty({ example: 1 })
  sequence: number;
}
