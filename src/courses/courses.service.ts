import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCoursesBodyDtoWithOwner, PatchCourseDto } from './dto';
import { MyCoursesService } from './my-courses.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly dbService: DbService,
    private readonly myCoursesService: MyCoursesService,
  ) {}
  async create(dto: CreateCoursesBodyDtoWithOwner, userId: number) {
    return await this.dbService.$transaction(async () => {
      const course = await this.dbService.course.create({
        data: dto,
      });
      await this.myCoursesService.addCourse(userId, course.id);
    });
  }

  async patchCourse(courseId: number, patch: PatchCourseDto) {
    return this.dbService.course.update({
      where: { id: courseId },
      data: { ...patch },
    });
  }

  async getCourse(courseId: number) {
    return this.dbService.course.findFirst({
      where: { id: courseId },
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
        message: 'Вы приобрели все существующие курсы!',
      });
    }
    return notMyCourses;
  }
}
