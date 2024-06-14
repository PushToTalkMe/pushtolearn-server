import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/configs/jwt.config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies[CookieService.tokenKey];

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
      throw new BadRequestException({ message: 'Нет доступа' });
    }
    return true;
  }
}
