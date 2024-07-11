import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  PatchUpdateRoleDto,
  SessionInfoDto,
  SignInBodyDto,
  SignUpBodyDto,
} from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';
import { UsersService } from '../users/users.service';
import { AdminGuard } from './admin.guard';
import { TelegramService } from '../telegram/telegram.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  async signUp(
    @Body() body: SignUpBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
    this.cookieService.setToken(res, accessToken);
    const message =
      'Регистрация нового пользователя\n' +
      `Email: ${body.email}\n` +
      `Имя: ${body.firstName}\n` +
      `Фамилия: ${body.lastName}`;
    await this.telegramService.sendMessage(message);
  }

  @Patch('update')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  async updateRole(@Body() patch: PatchUpdateRoleDto) {
    return this.usersService.update(patch.email, patch.role);
  }

  @Delete('delete')
  @ApiOkResponse({ type: String })
  @UseGuards(AuthGuard)
  async delete(
    @Res({ passthrough: true }) res: Response,
    @SessionInfo() session: SessionInfoDto,
  ) {
    this.cookieService.removeToken(res);
    return this.usersService.delete(session.email);
  }

  @Post('sign-in')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: SignInBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );
    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-out')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  @Get('session')
  @ApiOkResponse({
    type: SessionInfoDto,
  })
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: SessionInfoDto) {
    return session;
  }
}
