import { Injectable } from '@nestjs/common';
import { PatchAccountDto } from './dto';
import { DbService } from '../db/db.service';

@Injectable()
export class AccountService {
  constructor(private readonly dbService: DbService) {}
  async create(userId: number) {
    return this.dbService.account.create({
      data: {
        userId: userId,
        firstName: '',
        lastName: '',
        username: '',
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
      data: { ...patch },
    });
  }
}
