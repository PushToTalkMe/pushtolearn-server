import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonBodyDto {
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
