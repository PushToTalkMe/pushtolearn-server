import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTestDto {
  @ApiProperty({ example: 'Текст формата markdown' })
  @IsString()
  questions: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  lessonId: number;
}

export class PatchTestDto {
  @ApiProperty({ example: 'Введение' })
  @IsString()
  @IsOptional()
  questions?: string;
}

export class TestDto {
  @ApiProperty({ example: '5' })
  id: number;

  @ApiProperty({ example: '1' })
  lessonId: number;

  @ApiProperty({ example: 'Текст формата markdown' })
  questions: string;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-17T13:55:38.747Z' })
  updatedAt: Date;
}
