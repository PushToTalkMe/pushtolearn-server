import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from '../configs/jwt.config';
import { extractCookieValue } from '../helpers/extract-cookie-value';
import { CookieService } from './cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
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
      req['session'] = sessionInfo;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
