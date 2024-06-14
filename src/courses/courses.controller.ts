import {
  BadRequestException,
  Body,
  Controller,
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
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateCourseBodyDto,
  CreateCoursesBodyDtoWithOwner,
  PatchCourseDto,
} from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccountService } from 'src/account/account.service';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { CoursesService } from './courses.service';
import { SessionInfoDto } from 'src/auth/dto';
import { MyCoursesService } from './my-courses.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { SectionsService } from '../sections/sections.service';
import { PatchSectionDto } from '../sections/dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { LessonsService } from 'src/lessons/lessons.service';

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
    @Body() dto: CreateCourseBodyDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const { firstName, lastName } = await this.accountService.getAccount(
      session.id,
    );
    const author = firstName + ' ' + lastName;
    return this.coursesService.create(
      {
        ...dto,
        author,
      },
      session.id,
    );
  }

  @Patch('update/:courseId')
  @UseGuards(AdminGuard)
  @ApiOkResponse({
    type: CreateCourseBodyDto,
  })
  async patchCourse(
    @Param('courseId', IdValidationPipe) courseId: number,
    @Body() body: PatchCourseDto,
  ) {
    return this.coursesService.patchCourse(courseId, body);
  }

  @Get()
  @ApiOkResponse({
    type: [CreateCoursesBodyDtoWithOwner],
  })
  async getAllCourses(@SessionInfo() session: SessionInfoDto) {
    return this.coursesService.getAllCourses(session.id);
  }

  @Get('my')
  @ApiOkResponse({
    type: [CreateCoursesBodyDtoWithOwner],
  })
  async getMyCourses(@SessionInfo() session: SessionInfoDto) {
    return this.myCoursesService.getMyCourses(session.id);
  }

  @Get('my/:courseId')
  @ApiOkResponse({
    type: CreateCoursesBodyDtoWithOwner,
  })
  async getCourseById(
    @Param('courseId', IdValidationPipe) courseId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const course = await this.coursesService.getCourseById(
      courseId,
      session.id,
    );
    const sections =
      await this.sectionsService.getAllSectionsByCourseId(courseId);

    const sectionsWithLessonsTitle = await Promise.all(
      sections.map(async (section) => {
        const lessonsTitle =
          await this.sectionsService.getAllLessonsTitleBySectionId(section.id);
        return { ...section, lessonsTitle };
      }),
    );

    return { ...course, sectionsWithLessonsTitle };
  }

  @Get('/my/:courseId/sections/:sectionId/lessons/:lessonId')
  @ApiOkResponse({
    type: CreateCoursesBodyDtoWithOwner,
  })
  async getLessonById(
    @Param('courseId', IdValidationPipe) courseId: number,
    @Param('sectionId', IdValidationPipe) sectionId: number,
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const course = await this.coursesService.getCourseById(
      courseId,
      session.id,
    );
    if (!course) {
      throw new BadRequestException({ message: 'Курса не существует' });
    }
    const section = await this.sectionsService.getSectionBySectionId(sectionId);
    if (!section) {
      throw new BadRequestException({ message: 'Раздела не существует' });
    }
    const lesson = await this.lessonsService.getLessonByLessonId(lessonId);
    if (!lesson) {
      throw new BadRequestException({ message: 'Урока не существует' });
    }
    if (course.id === section.courseId && section.id === lesson.sectionId) {
      return lesson;
    } else {
      throw new BadRequestException({ message: 'Страница не существует' });
    }
  }
}
