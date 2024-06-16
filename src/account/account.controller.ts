import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AccountDto, PatchAccountDto } from './dto';
import { AccountService } from './account.service';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfo } from '../auth/session-info.decorator';
import { SessionInfoDto } from '../auth/dto';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  @ApiOkResponse({
    type: AccountDto,
  })
  getAccount(@SessionInfo() session: SessionInfoDto): Promise<AccountDto> {
    return this.accountService.getAccount(session.id);
  }

  @Patch()
  @ApiOkResponse({
    type: AccountDto,
  })
  patchAccount(
    @SessionInfo() session: SessionInfoDto,
    @Body() body: PatchAccountDto,
  ): Promise<AccountDto> {
    return this.accountService.patchAccount(session.id, body);
  }
}
