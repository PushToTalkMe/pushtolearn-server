import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/configs/jwt.config';
import { DbModule } from 'src/db/db.module';
import { LessonsController } from './lessons.controller';

@Module({
  imports: [
    DbModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [LessonsService],
  exports: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
