import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfoDto } from '../auth/dto';
import { SessionInfo } from '../auth/session-info.decorator';
import { BuyService } from './buy.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('buy')
@UseGuards(AuthGuard)
export class BuyController {
  constructor(
    private readonly buyService: BuyService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post(':courseId')
  @ApiCreatedResponse()
  async buyCourse(
    @Param('courseId', IdValidationPipe) courseId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    const buy = await this.buyService.buyCourse(session.id, courseId);
    const message =
      'Покупка курса\n' +
      `Email: ${session.email}\n` +
      `ID пользователя: ${session.id}\n` +
      `ID курса: ${courseId}\n`;
    this.telegramService.sendMessage(message);
    return buy;
  }
}
