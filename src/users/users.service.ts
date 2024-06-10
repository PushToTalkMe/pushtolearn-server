import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}
  findByEmail(email: string) {
    return this.dbService.user.findFirst({ where: { email } });
  }

  create(email: string, hash: string, salt: string) {
    return this.dbService.user.create({ data: { email, hash, salt } });
  }
}
