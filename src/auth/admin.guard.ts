import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from '../configs/jwt.config';
import { extractCookieValue } from '../helpers/extract-cookie-value';
import { CookieService } from './cookie.service';
import { NOT_PERMITTED } from './admin.constants';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const cookie = req.headers.cookie;

    if (!cookie) {
      throw new UnauthorizedException();
    }

    const token = extractCookieValue(cookie, CookieService.tokenKey);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const sessionInfo = this.jwtService.verifyAsync(token, {
        secret: this.configService.get(JWT_SECRET),
      });
      const { role } = await sessionInfo;
      if (role === 'admin') {
        req['session'] = sessionInfo;
      } else {
        throw new Error();
      }
    } catch {
      throw new ForbiddenException(NOT_PERMITTED);
    }
    return true;
  }
}
