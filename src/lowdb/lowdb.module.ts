import { Module } from '@nestjs/common';
import { LowDBService } from './lowdb.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LowDBService],
  exports: [LowDBService],
})
export class LowDBModule {}
