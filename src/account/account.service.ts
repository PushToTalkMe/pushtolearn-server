import { Injectable } from '@nestjs/common';
import { PatchAccountDto } from './dto';
import { DbService } from '../db/db.service';
import { AFile } from './avatar.class';
import { FilesService } from '../files/files.service';
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

  async getInfoAboutAllUsers() {
    const accounts = await this.dbService.account.findMany({
      orderBy: { id: 'asc' },
    });
    return Promise.all(
      accounts.map(async (account) => {
        const { role, email } = await this.dbService.user.findFirst({
          where: { id: account.userId },
        });
        const myCourses = await this.dbService.myCourse.findMany({
          where: { userId: account.userId },
        });
        return {
          userId: account.userId,
          email,
          firstName: account.firstName,
          lastName: account.lastName,
          countCourses: myCourses.length,
          role,
        };
      }),
    );
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
      const originalname = `${file.size}${userId}${Math.floor(Math.random() * Math.random() * 1000)}`;
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
