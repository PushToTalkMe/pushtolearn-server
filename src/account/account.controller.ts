import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import {
  AccountDto,
  InfoAboutAllUsers,
  PatchAccountDto,
  PatchAvatarDto,
} from './dto';
import { AccountService } from './account.service';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfo } from '../auth/session-info.decorator';
import { SessionInfoDto } from '../auth/dto';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AdminGuard } from '../auth/admin.guard';

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

  @Get('info')
  @ApiOkResponse({
    type: [InfoAboutAllUsers],
  })
  @UseGuards(AdminGuard)
  getInfoAboutAllUsers(): Promise<InfoAboutAllUsers[]> {
    return this.accountService.getInfoAboutAllUsers();
  }

  @Get('download/*')
  @ApiOkResponse()
  getAvatar(@Param('0') url: string, @Res() res: Response) {
    return this.accountService.getAvatar(url, res);
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

  @Patch('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PatchAvatarDto })
  @ApiOkResponse({
    type: AccountDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  patchAvatar(
    @SessionInfo() session: SessionInfoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AccountDto> {
    return this.accountService.patchAvatar(session.id, file);
  }
}
