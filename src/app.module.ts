import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from '@rekog/mcp-nest';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SleeperModule } from './sleeper/sleeper.module';
import { OpenAIModule } from './openai/openai.module';
import { LowDBModule } from './lowdb/lowdb.module';
import { SystemPromptModule } from './system-prompt/system-prompt.module';
import { LowDBService } from './lowdb/lowdb.service';
import { SleeperService } from './sleeper/sleeper.service';
import { HttpModule } from '@nestjs/axios';
import { AgentService } from './agent/agent.service';
import { GetNflStateTool } from './mcp/get-nfl-state.tool';
import { GetSleeperUserInfoTool } from './mcp/get-sleeper-user-info.tool';
import { GetSleeperLeaguesTool } from './mcp/get-sleeper-leagues.tool';
import { GetSleeperMatchupsTool } from './mcp/get-sleeper-matchups.tool';
import { GetSleeperRostersTool } from './mcp/get-sleeper-rosters.tool';
import { GetSleeperPlayersTool } from './mcp/get-sleeper-players.tool';
import { FantasyAnalysisTool } from './mcp/fantasy-analysis.tool';
import { DebugTool } from './mcp/debug-tool';

@Module({
  imports: [
    ConfigModule.forRoot(),
    McpModule.forRoot({
      name: 'sleeper-agent-mcp',
      version: '1.0.0',
    }),
    HttpModule,
    SleeperModule,
    OpenAIModule,
    LowDBModule,
    SystemPromptModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    LowDBService, 
    SleeperService, 
    AgentService,
    // GetNflStateTool,
    // GetSleeperUserInfoTool,
    // GetSleeperLeaguesTool,
    // GetSleeperMatchupsTool,
    // GetSleeperRostersTool,
    // GetSleeperPlayersTool,
    FantasyAnalysisTool,
    DebugTool,
  ],
})
export class AppModule {}
