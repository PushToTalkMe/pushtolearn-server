import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import {
  CreateLessonDto,
  LessonDto,
  PatchLessonDto,
  PatchSequences,
} from './dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { SessionInfoDto } from 'src/auth/dto';
import { DbService } from 'src/db/db.service';
import {
  COURSE_NOT_FOUND,
  LESSON_NOT_FOUND,
  SECTION_NOT_FOUND,
} from 'src/courses/constants';

@Controller('lessons')
@UseGuards(AuthGuard)
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly dbService: DbService,
  ) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(
    @Body() dto: CreateLessonDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.lessonsService.create(dto, session.id, session.role);
  }

  @Get(':lessonId')
  @ApiOkResponse({ type: LessonDto })
  async getLesson(
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const lesson = await this.dbService.lesson.findFirst({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new NotFoundException(LESSON_NOT_FOUND);
    }
    const section = await this.dbService.section.findFirst({
      where: { id: lesson.sectionId },
    });
    if (!section) {
      throw new NotFoundException(SECTION_NOT_FOUND);
    }
    const course = await this.dbService.course.findFirst({
      where: { id: section.courseId },
    });
    if (!course) {
      throw new NotFoundException(COURSE_NOT_FOUND);
    }
    if (course.authorId !== session.id && session.role !== 'admin') {
      throw new ForbiddenException('Нет доступа');
    }
    return this.lessonsService.getLesson(lessonId);
  }

  @Patch('update/:lessonId')
  @ApiOkResponse({
    type: LessonDto,
  })
  async patchLesson(
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @Body() body: PatchLessonDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.lessonsService.patchLesson(
      lessonId,
      body,
      session.id,
      session.role,
    );
  }

  @Post('update/sequences')
  @ApiOkResponse()
  async patchSequences(
    @Body() body: PatchSequences,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.lessonsService.patchSequences(body, session.id, session.role);
  }

  @Delete('delete/:lessonId')
  @ApiOkResponse({
    type: LessonDto,
  })
  async deletelesson(
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.lessonsService.delete(lessonId, session.id, session.role);
  }
}
