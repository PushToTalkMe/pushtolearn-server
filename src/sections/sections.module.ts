import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/configs/jwt.config';
import { DbModule } from 'src/db/db.module';
import { LessonsModule } from '../lessons/lessons.module';
import { SectionsController } from './sections.controller';

@Module({
  imports: [
    DbModule,
    ConfigModule,
    LessonsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [SectionsService],
  exports: [SectionsService],
  controllers: [SectionsController],
})
export class SectionsModule {}
