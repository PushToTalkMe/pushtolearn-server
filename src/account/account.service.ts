import { Injectable } from '@nestjs/common';
import { PatchAccountDto } from './dto';
import { DbService } from '../db/db.service';
import { AFile } from './avatar.class';
import sharp from 'sharp';
import { FilesService } from 'src/files/files.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class AccountService {
  constructor(
    private readonly dbService: DbService,
    private readonly filesService: FilesService,
  ) {}
  async create(userId: number, firstName: string, lastName: string) {
    return this.dbService.account.create({
      data: {
        userId,
        firstName,
        lastName,
        username: '',
        avatar: '',
      },
    });
  }

  async getAccount(userId: number) {
    return this.dbService.account.findFirstOrThrow({
      where: { userId },
    });
  }

  async patchAccount(userId: number, patch: PatchAccountDto) {
    return this.dbService.account.update({
      where: { userId },
      data: {
        firstName: patch.firstName,
        lastName: patch.lastName,
        username: patch.username,
      },
    });
  }

  async patchAvatar(userId: number, file: Express.Multer.File) {
    const { url } = await this.uploadAvatar(file, userId);
    return this.dbService.account.update({
      where: { userId },
      data: {
        avatar: url,
      },
    });
  }

  async uploadAvatar(file: Express.Multer.File, userId: number) {
    let saveFile: AFile = new AFile(file);
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer);
      const originalname = `${file.size}95345${userId}`;
      saveFile = new AFile({
        originalname: `${originalname.split('.')[0]}.webp`,
        buffer,
      });
    }
    return this.filesService.saveFiles(saveFile, `avatar/${userId}`);
  }

  async getAvatar(url: string, res: Response) {
    const response = fs.createReadStream(path.resolve(`./uploads/${url}`));
    response.pipe(res);
  }

  async deleteAccount(userId: number) {
    return this.dbService.account.delete({
      where: { userId },
    });
  }
}
