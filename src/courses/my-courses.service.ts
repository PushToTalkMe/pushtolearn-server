import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { COURSE_ALREADY_ADDED } from './constants';

@Injectable()
export class MyCoursesService {
  constructor(private readonly dbService: DbService) {}

  async addCourse(userId: number, courseId: number) {
    const myCourse = await this.dbService.myCourse.findFirst({
      where: { userId, courseId },
    });
    if (myCourse) {
      throw new BadRequestException(COURSE_ALREADY_ADDED);
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
      orderBy: { sequence: 'asc' },
    });
  }

  async deleteMyCoursesByCourseId(courseId: number) {
    return this.dbService.myCourse.deleteMany({ where: { courseId } });
  }

  async deleteMyCoursesByUserId(userId: number) {
    return this.dbService.myCourse.deleteMany({ where: { userId } });
  }

  async getNotMyCourses(userId: number) {
    const myCoursesId = await this.getMyCoursesId(userId);
    return this.dbService.course.findMany({
      where: { id: { notIn: myCoursesId } },
      orderBy: { sequence: 'asc' },
    });
  }
}
