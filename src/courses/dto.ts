import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseBodyDto {
  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://imgs.ru/img#23124123' })
  @IsString()
  img: string;

  @ApiProperty({ example: '7.5 часов' })
  @IsString()
  duration: string;

  @ApiProperty({ example: ['Frontend', 'Backend', 'Fullstack'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 3999 })
  @IsNumber()
  price: number;
}

export class CreateCoursesBodyDtoWithOwner extends CreateCourseBodyDto {
  author: string;
}

export class PatchCourseDto {
  @ApiProperty({ example: 'NextJS + NestJS' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'https://imgs.ru/img#23124123' })
  @IsString()
  @IsOptional()
  img?: string;

  @ApiProperty({ example: '7.5 часов' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ example: ['Frontend', 'Backend', 'Fullstack'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 3999 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: '5' })
  @IsNumber()
  @IsOptional()
  sequence?: number;
}
