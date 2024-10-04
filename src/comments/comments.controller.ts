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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateCommentDto, GetCommentDto } from './dto';
import { CommentsService } from './comments.service';
import { AccountService } from '../account/account.service';
import { SessionInfo } from '../auth/session-info.decorator';
import { SessionInfoDto } from '../auth/dto';
import { LessonsService } from '../lessons/lessons.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly accountService: AccountService,
    private readonly lessonService: LessonsService,
    private readonly telegramService: TelegramService,
  ) {}
  @Post('create')
  @ApiCreatedResponse()
  async create(
    @SessionInfo() session: SessionInfoDto,
    @Body() dto: CreateCommentDto,
  ) {
    const account = await this.accountService.getAccount(session.id);
    if (!account) {
      throw new NotFoundException('Аккаунт не найден');
    }
    await this.lessonService.getLesson(dto.lessonId);

    const comment = await this.commentsService.create({
      ...dto,
      email: session.email,
      userId: session.id,
      firstName: account.firstName,
      lastName: account.lastName,
    });
    const message =
      'Комментарий пользователя\n' +
      `Имя: ${comment.firstName + ' ' + comment.lastName}\n` +
      `Email: ${comment.email}\n` +
      `ID пользователя: ${comment.userId}\n` +
      `ID урока: ${dto.lessonId}\n` +
      `Комментарий: ${dto.text}\n`;

    try {
      await this.telegramService.sendMessage(message);
    } catch (e) {
      return;
    }

    return comment;
  }

  @Get(':lessonId')
  @ApiOkResponse({ type: [GetCommentDto] })
  async getComments(@Param('lessonId', IdValidationPipe) lessonId: number) {
    return this.commentsService.getComments(lessonId);
  }

  // @Patch('update/:commentId')
  // @ApiOkResponse({
  //   type: CommentDto,
  // })
  // async patchComment(
  //   @Param('commentId', IdValidationPipe) CommentId: number,
  //   @Body() body: PatchCommentDto,
  // ) {
  //   return this.commentsService.patchComment(CommentId, body);
  // }
}
