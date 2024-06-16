import {
  Body,
  Controller,
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
import { CreateLessonBodyDto, PatchLessonDto } from './dto';

@Controller('lessons')
@UseGuards(AuthGuard)
@UseGuards(AdminGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(@Body() dto: CreateLessonBodyDto) {
    return this.lessonsService.create(dto);
  }

  @Patch('update/:lessonId')
  @ApiOkResponse({
    type: CreateLessonBodyDto,
  })
  async patchCourse(
    @Param('lessonId', IdValidationPipe) lessonId: number,
    @Body() body: PatchLessonDto,
  ) {
    return this.lessonsService.patchLesson(lessonId, body);
  }
}
