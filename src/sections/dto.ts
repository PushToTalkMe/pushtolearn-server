import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSectionBodyDto {
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
