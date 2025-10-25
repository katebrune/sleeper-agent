import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { LowDBModule } from 'src/lowdb/lowdb.module';
import { OpenAIService } from 'src/openai/openai.service';

@Module({
  imports: [LowDBModule, OpenAIService],
  controllers: [],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
