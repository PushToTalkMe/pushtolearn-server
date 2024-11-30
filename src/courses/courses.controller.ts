import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import {
  CourseDto,
  CourseDtoWithLessonCount,
  CourseDtoWithUserStat,
  CourseDtoWithSections,
  CreateCourseDto,
  CreateCoursesDtoWithOwner,
  PatchCourseDto,
} from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccountService } from '../account/account.service';
import { SessionInfo } from '../auth/session-info.decorator';
import { CoursesService } from './courses.service';
import { SessionInfoDto } from '../auth/dto';
import { MyCoursesService } from './my-courses.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { SectionsService } from '../sections/sections.service';
import { AdminGuard } from '../auth/admin.guard';
import { LessonsService } from '../lessons/lessons.service';
import {
  COURSE_NOT_FOUND,
  LESSON_NOT_FOUND,
  PAGE_NOT_FOUND,
  SECTION_NOT_FOUND,
} from './constants';
import { LessonDto, LessonDtoWithViewed } from '../lessons/dto';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly accountService: AccountService,
    private readonly myCoursesService: MyCoursesService,
    private readonly sectionsService: SectionsService,
    private readonly lessonsService: LessonsService,
  ) {}
  @Post('create')
  @UseGuards(AdminGuard)
  @ApiCreatedResponse()
  async create(
    @Body() dto: CreateCourseDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const { firstName, lastName } = await this.accountService.getAccount(
      session.id,
    );
    const author = firstName + ' ' + lastName;
    return this.coursesService.create({
      ...dto,
      author,
    });
  }

  // @Patch('addCourseForAdmin')
  // @UseGuards(AdminGuard)
  // @ApiCreatedResponse()
  // async patchMyCourse(
  //   @Body() dto: CreateCourseDto,
  //   @SessionInfo() session: SessionInfoDto,
  // ) {
  //   const { firstName, lastName } = await this.accountService.getAccount(
  //     session.id,
  //   );
  //   const author = firstName + ' ' + lastName;
  //   return this.coursesService.create(
  //     {
  //       ...dto,
  //       author,
  //     },
  //     session.id,
  //   );
  // }

  @Patch('update/:courseId')
  @UseGuards(AdminGuard)
  @ApiOkResponse({
    type: CreateCourseDto,
  })
  async patchCourse(
    @Param('courseId', IdValidationPipe) courseId: number,
    @Body() body: PatchCourseDto,
  ) {
    return this.coursesService.patchCourse(courseId, body);
  }

  @Get()
  @ApiOkResponse({
    type: [CourseDto],
  })
  async getAllCourses(@SessionInfo() session: SessionInfoDto) {
    return this.coursesService.getAllCoursesFromNotMy(session.id);
  }

  @Delete(':courseId')
  @UseGuards(AdminGuard)
  @ApiOkResponse({
    type: CourseDto,
  })
  async delete(@Param('courseId', IdValidationPipe) courseId: number) {
    const deletedCourse = await this.coursesService.delete(courseId);
    if (!deletedCourse) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }
  }

  @Get('notMy/:courseId')
  @ApiOkResponse({
    type: CourseDtoWithLessonCount,
  })
  async getNotMyCourseById(
    @Param('courseId', IdValidationPipe) courseId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    let lessonCount = 0;
    const course = await this.coursesService.getCourseFromNotMy(
      courseId,
      session.id,
    );
    const sections =
      await this.sectionsService.getAllSectionsByCourseId(courseId);
    await Promise.all(
      sections.map(async (section) => {
        const lessonsTitle =
          await this.sectionsService.getAllSectionsWithLessons(section.id);
        lessonsTitle.forEach(() => {
          lessonCount += 1;
        });
      }),
    );

    return { ...course, lessonCount };
  }

  @Get('my')
  @ApiOkResponse({
    type: [CourseDtoWithUserStat],
  })
  async getMyCourses(@SessionInfo() session: SessionInfoDto) {
    const courses = await this.myCoursesService.getMyCourses(session.id);
    const coursesWithUserStat = await Promise.all(
      courses.map(async (course) => {
        let lessonCount = 0;
        const sections = await this.sectionsService.getAllSectionsByCourseId(
          course.id,
        );
        await Promise.all(
          sections.map(async (section) => {
            const lessonsStat =
              await this.sectionsService.getAllSectionsWithLessons(section.id);
            lessonsStat.forEach(() => {
              lessonCount += 1;
            });
          }),
        );
        return { ...course, lessonCount };
      }),
    );
    return coursesWithUserStat;
  }

  @Get('my/:courseId')
  @ApiOkResponse({
    type: CourseDtoWithSections,
  })
  async getCourseById(
    @Param('courseId', IdValidationPipe) courseId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const course = await this.coursesService.getCourseFromMy(
      courseId,
      session.id,
    );
    let lessonCount = 0;
    const sections =
      await this.sectionsService.getAllSectionsByCourseId(courseId);
    const sectionsWithLessonsStat = await Promise.all(
      sections.map(async (section) => {
        const lessonsStat =
          await this.sectionsService.getAllLessonsStatBySectionId(
            section.id,
            session.id,
          );
        lessonsStat.forEach(() => {
          lessonCount += 1;
        });
        return { ...section, lessonsStat };
      }),
    );

    return { ...course, sectionsWithLessonsStat, lessonCount };
  }

  @Get('/my/:courseId/sections/:sectionId/lessons/:lessonId')
  @ApiOkResponse({
    type: LessonDtoWithViewed,
  })
  async getPageLesson(
    @Param('courseId', IdValidationPipe) courseId: number,
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const course = await this.coursesService.getCourseFromMy(
      courseId,
      session.id,
    );
    if (!course) {
      throw new BadRequestException(COURSE_NOT_FOUND);
    }
    const section = await this.sectionsService.getSection(sectionId);
    if (!section) {
      throw new BadRequestException(SECTION_NOT_FOUND);
    }
    const lesson = await this.lessonsService.getLesson(lessonId);
    if (!lesson) {
      throw new BadRequestException(LESSON_NOT_FOUND);
    }
    if (course.id === section.courseId && section.id === lesson.sectionId) {
      await this.myCoursesService.patchHistoryStat(session.id, courseId, {
        historySectionId: sectionId,
        historyLessonId: lessonId,
      });
      const { viewed } = await this.myCoursesService.getUserStatLesson(
        session.id,
        lessonId,
      );
      return { ...lesson, viewed };
    } else {
      throw new BadRequestException(PAGE_NOT_FOUND);
    }
  }

  @Patch('/my/:courseId/sections/:sectionId/lessons/:lessonId/viewed')
  @ApiOkResponse({
    type: Boolean,
  })
  async lessonViewed(
    @Param('courseId', IdValidationPipe) courseId: number,
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const course = await this.coursesService.getCourseFromMy(
      courseId,
      session.id,
    );
    if (!course) {
      throw new BadRequestException(COURSE_NOT_FOUND);
    }
    const section = await this.sectionsService.getSection(sectionId);
    if (!section) {
      throw new BadRequestException(SECTION_NOT_FOUND);
    }
    const lesson = await this.lessonsService.getLesson(lessonId);
    if (!lesson) {
      throw new BadRequestException(LESSON_NOT_FOUND);
    }
    if (course.id === section.courseId && section.id === lesson.sectionId) {
      const { viewed } = await this.myCoursesService.patchUserStatLesson(
        session.id,
        lessonId,
        true,
      );
      return { viewed };
    } else {
      throw new BadRequestException(PAGE_NOT_FOUND);
    }
  }
}
