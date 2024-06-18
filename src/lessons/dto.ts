import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Текст в формате markdown' })
  @IsString()
  text: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  sectionId: number;
}

export class PatchLessonDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Текст в формате markdown' })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ example: '5' })
  @IsNumber()
  @IsOptional()
  sequence?: number;
}

export class LessonDto {
  @ApiProperty({ example: '5' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: '1' })
  @IsNumber()
  sectionId: number;

  @ApiProperty({ example: '2' })
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: 'Что такое NestJS' })
  @IsString()
  title: string;

  @ApiProperty({ example: '## Что такое NestJS' })
  @IsString()
  text: string;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  @IsDate()
  createdAt: Date;
}
