import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './files.dto';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFiles(file: MFile): Promise<FileElementResponse> {
    console.log(file);
    const dateFolder = format(new Date(), 'dd-MM-yyyy');
    const uploadFolder = `uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
    return {
      url: `${dateFolder}/${file.originalname}`,
      name: file.originalname,
    };
  }

  convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp().toBuffer();
  }
}
