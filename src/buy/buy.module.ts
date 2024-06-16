import { Module } from '@nestjs/common';
import { BuyController } from './buy.controller';
import { BuyService } from './buy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { CoursesModule } from '../courses/courses.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    CoursesModule,
    ConfigModule,
    DbModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  controllers: [BuyController],
  providers: [BuyService],
})
export class BuyModule {}
