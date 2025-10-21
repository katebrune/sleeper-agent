import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SleeperModule } from './sleeper/sleeper.module';
import { OpenAIModule } from './openai/openai.module';
import { LowDBModule } from './lowdb/lowdb.module';
import { SystemPromptModule } from './system-prompt/system-prompt.module';
import { ToolsModule } from './tools/tools.module';
import { LowDBService } from './lowdb/lowdb.service';
import { SleeperService } from './sleeper/sleeper.service';
import { HttpModule } from '@nestjs/axios';
import { AgentService } from './agent/agent.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, SleeperModule, OpenAIModule, LowDBModule, SystemPromptModule, ToolsModule],
  controllers: [AppController],
  providers: [AppService, LowDBService, SleeperService, AgentService],
})
export class AppModule {}
