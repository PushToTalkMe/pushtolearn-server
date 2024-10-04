import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  lessonId: number;

  @ApiProperty({
    example: 'Комментарий',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class GetCommentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    example: 'Имя',
  })
  firstName: string;

  @ApiProperty({
    example: 'Фамилия',
  })
  lastName: string;

  @ApiProperty({
    example: 'Комментарий',
  })
  text: string;

  @ApiProperty({
    example: '2024-07-01T10:23:15.094Z',
  })
  createdAt: Date;
}

export class CommentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@mail.ru' })
  email: string;

  @ApiProperty({
    example: 1,
  })
  userId: number;

  @ApiProperty({
    example: 'Имя',
  })
  firstName: string;

  @ApiProperty({
    example: 'Фамилия',
  })
  lastName: string;

  @ApiProperty({
    example: 1,
  })
  lessonId: number;

  @ApiProperty({
    example: 'Комментарий',
  })
  text: string;

  @ApiProperty({
    example: '2024-07-01T10:23:15.094Z',
  })
  createdAt: Date;
}
