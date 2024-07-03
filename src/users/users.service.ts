import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { DbService } from '../db/db.service';
import { USER_DELETED, USER_NOT_FOUND } from './constants';
import { MyCoursesService } from '../courses/my-courses.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly accountService: AccountService,
    private readonly myCoursesService: MyCoursesService,
  ) {}
  findByEmail(email: string) {
    return this.dbService.user.findFirst({ where: { email } });
  }

  async create(
    email: string,
    hash: string,
    salt: string,
    role: string,
    firstName: string,
    lastName: string,
  ) {
    return await this.dbService.$transaction(async () => {
      const user = await this.dbService.user.create({
        data: { email, hash, salt, role },
      });
      await this.accountService.create(user.id, firstName, lastName);
      return user;
    });
  }

  async update(email: string, role: string) {
    const user = await this.dbService.user.update({
      where: { email },
      data: { role },
    });
    return user.role;
  }

  async delete(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return this.dbService.$transaction(async () => {
      await this.accountService.deleteAccount(user.id);
      await this.myCoursesService.deleteMyCoursesByUserId(user.id);
      await this.dbService.userStatLesson.deleteMany({
        where: { userId: user.id },
      });
      await this.dbService.user.delete({ where: { id: user.id } });
      return { message: USER_DELETED };
    });
  }
}
