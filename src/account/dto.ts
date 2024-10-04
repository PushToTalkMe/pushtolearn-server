import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'Vlad',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Ilyin',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'PushToTalk',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: '/uploads/avatar/avatar.png',
  })
  @IsString()
  avatar: string;
}

export class InfoAboutAllUsers {
  @ApiProperty({
    example: 1,
  })
  userId: number;

  @ApiProperty({
    example: 'test@mail.ru',
  })
  email: string;

  @ApiProperty({
    example: 'Иван',
  })
  firstName: string;

  @ApiProperty({
    example: 'Иванов',
  })
  lastName: string;

  @ApiProperty({
    example: 0,
  })
  countCourses: number;

  @ApiProperty({
    example: 'student',
  })
  role: string;
}

export class PatchAccountDto {
  @ApiProperty({
    example: 'Vlad',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Ilyin',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'PushToTalk',
  })
  @IsString()
  @IsOptional()
  username?: string;
}

export class PatchAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File;
}
