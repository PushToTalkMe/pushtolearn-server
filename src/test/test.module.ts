import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
