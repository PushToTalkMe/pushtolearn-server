import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { CoursesModule } from './courses/courses.module';
import { BuyModule } from './buy/buy.module';
import { TheoryModule } from './theory/theory.module';
import { TestModule } from './test/test.module';
import { ExerciseModule } from './exercise/exercise.module';
import { CommentsModule } from './comments/comments.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTelegramConfig } from './configs/telegram.config';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    UsersModule,
    AccountModule,
    CoursesModule,
    BuyModule,
    TheoryModule,
    TestModule,
    ExerciseModule,
    CommentsModule,
    FilesModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
  ],
})
export class AppModule {}
