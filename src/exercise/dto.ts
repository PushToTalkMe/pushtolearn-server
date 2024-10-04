import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Текст формата markdown' })
  @IsString()
  tasks: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  lessonId: number;
}

export class PatchExerciseDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  tasks?: string;
}

export class ExerciseDto {
  @ApiProperty({ example: '5' })
  id: number;

  @ApiProperty({ example: '1' })
  lessonId: number;

  @ApiProperty({ example: 'Текст формата markdown' })
  tasks: string;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}
