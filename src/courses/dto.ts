import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

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

export class GetAllCoursesDto extends CreateCourseBodyDto {
  author: string;
}
