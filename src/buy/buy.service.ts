import { Injectable, NotFoundException } from '@nestjs/common';
import { MyCoursesService } from '../courses/my-courses.service';
import { DbService } from '../db/db.service';

@Injectable()
export class BuyService {
  constructor(
    private readonly dbService: DbService,
    private readonly myCoursesService: MyCoursesService,
  ) {}
  async buyCourse(userId: number, courseId: number) {
    return this.myCoursesService.addCourse(userId, courseId);
  }
}
