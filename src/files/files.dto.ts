import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class FileElementResponse {
  url: string;
  name: string;
}

export class UploadFileDto {
  @ApiProperty({ example: { file: { type: 'string', format: 'binary' } } })
  @IsObject()
  file: {
    type: 'string';
    format: 'binary';
  };
}
