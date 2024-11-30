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
