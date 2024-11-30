import { Module } from '@nestjs/common';
import { TheoryService } from './theory.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TheoryService],
  exports: [TheoryService],
})
export class TheoryModule {}
