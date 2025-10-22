import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { LowDBModule } from 'src/lowdb/lowdb.module';
import { OpenAIService } from 'src/openai/openai.service';
import { ToolsService } from 'src/tools/tools.service';

@Module({
  imports: [LowDBModule, OpenAIService, ToolsService],
  controllers: [],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
