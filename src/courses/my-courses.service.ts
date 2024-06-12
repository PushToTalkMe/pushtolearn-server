import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class MyCoursesService {
  constructor(private readonly dbService: DbService) {}

  async addCourse(userId: number, courseId: number) {
    const myCourse = await this.dbService.myCourse.findFirst({
      where: { userId, courseId },
    });
    if (myCourse) {
      throw new BadRequestException({ message: 'Данный курс уже добавлен' });
    }
    return this.dbService.myCourse.create({
      data: {
        courseId,
        userId,
      },
    });
  }

  async getMyCoursesId(userId: number) {
    const myCourses = await this.dbService.myCourse.findMany({
      where: { userId },
    });
    return myCourses.map((course) => course.courseId);
  }

  async getMyCourses(userId: number) {
    const myCoursesId = await this.getMyCoursesId(userId);
    return this.dbService.course.findMany({
      where: { id: { in: myCoursesId } },
    });
  }

  async getNotMyCourses(userId: number) {
    const myCoursesId = await this.getMyCoursesId(userId);
    return this.dbService.course.findMany({
      where: { id: { notIn: myCoursesId } },
    });
  }
}
