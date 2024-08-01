import {
  Body,
  Controller,
  Delete,
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

@Controller('lessons')
@UseGuards(AuthGuard)
@UseGuards(AdminGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Patch('update/:lessonId')
  @ApiOkResponse({
    type: LessonDto,
  })
  async patchLesson(
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @Body() body: PatchLessonDto,
  ) {
    return this.lessonsService.patchLesson(lessonId, body);
  }

  @Post('update/sequences')
  @ApiOkResponse()
  async patchSequences(@Body() body: PatchSequences) {
    return this.lessonsService.patchSequences(body);
  }

  @Delete('delete/:lessonId')
  @ApiOkResponse({
    type: LessonDto,
  })
  async deletelesson(@Param('lessonId', IdValidationPipe) lessonId: number) {
    return this.lessonsService.delete(lessonId);
  }
}
