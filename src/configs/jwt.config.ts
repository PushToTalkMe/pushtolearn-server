import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

const JWT_SECRET = 'JWT_SECRET';

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    global: true,
    secret: configService.get(JWT_SECRET),
    signOptions: { expiresIn: '1d' },
  };
};
