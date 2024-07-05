import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTheoryDto {
  @ApiProperty({ example: 'Текст формата markdown' })
  @IsString()
  content: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  lessonId: number;
}

export class PatchTheoryDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  content?: string;
}

export class TheoryDto {
  @ApiProperty({ example: '5' })
  id: number;

  @ApiProperty({ example: '1' })
  lessonId: number;

  @ApiProperty({ example: 'Текст формата markdown' })
  content: string;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}
