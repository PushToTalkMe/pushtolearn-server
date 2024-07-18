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

  @ApiProperty({
    example: '/uploads/avatar/avatar.png',
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class PatchAccountDto {
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
  @IsOptional()
  username?: string;
}

export class PatchAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File;
}
