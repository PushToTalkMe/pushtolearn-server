import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BuyCourseDto {
  @ApiProperty({ example: '1' })
  @IsNumber()
  courseId: number;
}
