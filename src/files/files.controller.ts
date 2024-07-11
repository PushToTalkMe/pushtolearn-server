import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse, UploadFileDto } from './files.dto';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @ApiOperation({ summary: 'Загрузка одного файла' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UploadFileDto })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse> {
    let saveFile: MFile = new MFile(file);
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer);
      saveFile = new MFile({
        originalname: `${file.originalname.split('.')[0]}.webp`,
        buffer,
      });
    }
    return this.filesService.saveFiles(saveFile);
  }
}
