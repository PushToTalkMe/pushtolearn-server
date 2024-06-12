import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCourseBodyDto } from './dto';
import { MyCoursesService } from './my-courses.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly dbService: DbService,
    private readonly myCoursesService: MyCoursesService,
  ) {}
  async create(dto: CreateCourseBodyDto & { author: string }) {
    return this.dbService.course.create({
      data: dto,
    });
  }

  async getCourseById(courseId: number, userId: number) {
    const myCourses = await this.myCoursesService.getMyCourses(userId);
    if (!myCourses) {
      throw new BadRequestException({
        message: 'У вас нет приобретенных курсов',
      });
    }
    const myCourse = myCourses.find((course) => course.id === courseId);
    if (!myCourse) {
      throw new BadRequestException({
        message: 'У вас нет курсов по данному id',
      });
    }
    return myCourse;
  }

  async getAllCourses(userId: number) {
    const notMyCourses = this.myCoursesService.getNotMyCourses(userId);
    if (!notMyCourses) {
      throw new BadRequestException({
        message: 'Вы приобрели все существующие курсы',
      });
    }
    return notMyCourses;
  }
}
