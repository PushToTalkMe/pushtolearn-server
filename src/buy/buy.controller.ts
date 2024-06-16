import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfoDto } from '../auth/dto';
import { SessionInfo } from '../auth/session-info.decorator';
import { BuyService } from './buy.service';
import { BuyCourseDto } from './dto';

@Controller('buy')
@UseGuards(AuthGuard)
export class BuyController {
  constructor(private readonly buyService: BuyService) {}

  @Post()
  @ApiCreatedResponse()
  async buyCourse(
    @Body() dto: BuyCourseDto,
    @SessionInfo() session: SessionInfoDto,
  ) {
    return this.buyService.buyCourse(session.id, dto.courseId);
  }
}
