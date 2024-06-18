import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfoDto } from '../auth/dto';
import { SessionInfo } from '../auth/session-info.decorator';
import { BuyService } from './buy.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('buy')
@UseGuards(AuthGuard)
export class BuyController {
  constructor(private readonly buyService: BuyService) {}

  @Post(':courseId')
  @ApiCreatedResponse()
  async buyCourse(
    @Param('courseId', IdValidationPipe) courseId: number,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.buyService.buyCourse(session.id, courseId);
  }
}
