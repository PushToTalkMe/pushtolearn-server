import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MyCoursesService } from '../courses/my-courses.service';
import { DbService } from '../db/db.service';
import { CoursesService } from '../courses/courses.service';
import { COURSE_NOT_FOUND } from '../courses/constants';

@Injectable()
export class BuyService {
  constructor(
    private readonly dbService: DbService,
    private readonly myCoursesService: MyCoursesService,
    private readonly coursesService: CoursesService,
  ) {}
  async buyCourse(userId: number, courseId: number) {
    const course = await this.coursesService.getCourse(courseId);
    if (!course) {
      throw new BadRequestException(COURSE_NOT_FOUND);
    }
    return this.myCoursesService.addCourse(userId, courseId);
  }
}
