import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCourseBodyDto, GetAllCoursesDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccountService } from 'src/account/account.service';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { CoursesService } from './courses.service';
import { SessionInfoDto } from 'src/auth/dto';
import { MyCoursesService } from './my-courses.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly accountService: AccountService,
    private readonly myCoursesService: MyCoursesService,
  ) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(
    @Body() dto: CreateCourseBodyDto,
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

  @Get()
  @ApiOkResponse({
    type: [GetAllCoursesDto],
  })
  async getAllCourses(@SessionInfo() session: SessionInfoDto) {
    return this.coursesService.getAllCourses(session.id);
  }

  @Get('my')
  @ApiOkResponse({
    type: [GetAllCoursesDto],
  })
  async getMyCourses(@SessionInfo() session: SessionInfoDto) {
    return this.myCoursesService.getMyCourses(session.id);
  }

  @Get('/my/:courseId')
  @ApiOkResponse({
    type: GetAllCoursesDto,
  })
  async getCourseById(
    @Param('courseId', IdValidationPipe) courseId: string,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.coursesService.getCourseById(+courseId, session.id);
  }
}
