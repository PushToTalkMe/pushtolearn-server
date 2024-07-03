import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpBodyDto {
  @ApiProperty({ example: 'test@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;
}

export class SignInBodyDto {
  @ApiProperty({ example: 'test@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;
}

export class SessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  'iat': number;

  @ApiProperty()
  'exp': number;
}

export class PatchUpdateRoleDto {
  @ApiProperty({ example: 'student@mail.ru' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}
