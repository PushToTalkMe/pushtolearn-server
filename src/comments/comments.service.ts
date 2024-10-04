import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private readonly dbService: DbService) {}
  async create({
    lessonId,
    text,
    userId,
    email,
    firstName,
    lastName,
  }: CreateCommentDto & {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    return this.dbService.comment.create({
      data: {
        userId,
        firstName,
        lastName,
        email,
        lessonId,
        text,
      },
    });
  }

  async getComments(lessonId: number) {
    return this.dbService.comment.findMany({
      where: { lessonId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        text: true,
      },
    });
  }
  // async patchAccount(userId: number, patch: PatchAccountDto) {
  //   return this.dbService.account.update({
  //     where: { userId },
  //     data: { ...patch },
  //   });
  // }
  // async deleteAccount(userId: number) {
  //   return this.dbService.account.delete({
  //     where: { userId },
  //   });
  // }
}
