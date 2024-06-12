import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly accountService: AccountService,
  ) {}
  findByEmail(email: string) {
    return this.dbService.user.findFirst({ where: { email } });
  }

  async create(email: string, hash: string, salt: string) {
    return await this.dbService.$transaction(async () => {
      const user = await this.dbService.user.create({
        data: { email, hash, salt },
      });
      await this.accountService.create(user.id);
      return user;
    });
  }
}
