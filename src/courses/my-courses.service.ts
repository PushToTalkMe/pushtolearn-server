import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  COURSE_ALREADY_ADDED,
  COURSE_NOT_FOUND,
  COURSE_NOT_PURCHASED,
  LESSON_NOT_FOUND,
  LESSON_YET_VIEWED,
  SECTION_NOT_FOUND,
} from './constants';
import { CreateUserStatLessonDto, PatchMyCourseStatDto } from './dto';

@Injectable()
export class MyCoursesService {
  constructor(private readonly dbService: DbService) {}

  async addCourse(userId: number, courseId: number) {
    const course = await this.dbService.course.findFirst({
      where: { id: courseId },
    });
    if (!course) {
      throw new BadRequestException(COURSE_NOT_FOUND);
    }
    const sections = await this.dbService.section.findMany({
      where: { courseId },
      orderBy: { sequence: 'asc' },
    });

    const firstSectionId = sections[0] ? sections[0].id : null;
    if (!firstSectionId) {
      throw new BadRequestException(SECTION_NOT_FOUND);
    }
    const lessonsFirstSection = await this.dbService.lesson.findMany({
      where: { sectionId: firstSectionId },
      orderBy: { sequence: 'asc' },
    });
    const firstLessonId = lessonsFirstSection[0]
      ? lessonsFirstSection[0].id
      : null;
    if (!firstLessonId) {
      throw new BadRequestException(LESSON_NOT_FOUND);
    }
    const myCourse = await this.dbService.myCourse.findFirst({
      where: { userId, courseId },
    });
    if (myCourse) {
      throw new BadRequestException(COURSE_ALREADY_ADDED);
    }
    await Promise.all(
      sections.map(async (section) => {
        const lessons = await this.dbService.lesson.findMany({
          where: { sectionId: section.id },
          orderBy: { sequence: 'asc' },
        });
        lessons.map(async (lesson) => {
          await this.createUserStatLesson(userId, lesson.id);
        });
      }),
    );
    return this.dbService.myCourse.create({
      data: {
        courseId,
        userId,
        lessonCompleted: 0,
        historySectionId: firstSectionId,
        historyLessonId: firstLessonId,
      },
    });
  }

  async patchHistoryStat(
    userId: number,
    courseId: number,
    patch: PatchMyCourseStatDto,
  ) {
    const { id } = await this.dbService.myCourse.findFirst({
      where: { userId, courseId },
    });
    if (!id) {
      throw new BadRequestException(COURSE_NOT_PURCHASED);
    }
    return this.dbService.myCourse.update({
      where: { id },
      data: { ...patch },
    });
  }

  async patchLessonCompleted(userId: number, courseId: number) {
    const { id, lessonCompleted } = await this.dbService.myCourse.findFirst({
      where: { courseId, userId },
    });
    return this.dbService.myCourse.update({
      where: { id },
      data: { lessonCompleted: lessonCompleted + 1 },
    });
  }

  async createUserStatLesson(userId: number, lessonId: number) {
    return this.dbService.userStatLesson.create({
      data: { lessonId, userId, viewed: false },
    });
  }

  async getUserStatLesson(userId: number, lessonId: number) {
    return this.dbService.userStatLesson.findFirst({
      where: { userId, lessonId },
    });
  }

  async patchUserStatLesson(userId: number, lessonId: number, viewed: boolean) {
    const { id, viewed: currentViewed } =
      await this.dbService.userStatLesson.findFirst({
        where: { userId, lessonId },
      });
    if (currentViewed) {
      throw new BadRequestException(LESSON_YET_VIEWED);
    }
    return this.dbService.userStatLesson.update({
      where: { id },
      data: { viewed },
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
    const courses = await this.dbService.course.findMany({
      where: { id: { in: myCoursesId } },
      orderBy: { updatedAt: 'desc' },
    });
    const coursesWithUserStat = await Promise.all(
      courses.map(async (course) => {
        const lessonWithUserStat = await this.dbService.myCourse.findFirst({
          where: { courseId: course.id, userId },
          select: {
            lessonCompleted: true,
            historyLessonId: true,
            historySectionId: true,
          },
        });
        return { ...course, ...lessonWithUserStat };
      }),
    );
    return coursesWithUserStat;
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
      orderBy: [{ inDeveloping: 'asc' }, { updatedAt: 'desc' }],
    });
  }
}
