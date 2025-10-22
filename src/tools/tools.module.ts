import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ToolsService } from './tools.service';
import { SleeperModule } from 'src/sleeper/sleeper.module';
import { SleeperService } from 'src/sleeper/sleeper.service';
import { GetSleeperUserInfoTool } from './get-sleeper-user-info.tool';
import { GetSleeperLeaguesTool } from './get-sleeper-leagues.tool';
import { GetSleeperRostersTool } from './get-sleeper-rosters.tool';
import { GetSleeperPlayersTool } from './get-sleeper-players.tool';
import { LowDBModule } from 'src/lowdb/lowdb.module';
import { LowDBService } from 'src/lowdb/lowdb.service';
import { GetNflStateTool } from './get-nfl-state.tool';
import { GetSleeperMatchupsTool } from './get-sleeper-matchups.tool';
import { WebSearchTool } from './web-search-tool';
import { WebSearchModule } from 'src/web-search/web-search.module';

@Module({
  imports: [SleeperModule, HttpModule, LowDBModule, WebSearchModule],
  controllers: [],
  providers: [
    ToolsService,
    SleeperService,
    LowDBService,
    GetSleeperUserInfoTool,
    GetSleeperLeaguesTool,
    GetSleeperRostersTool,
    GetSleeperPlayersTool,
    GetNflStateTool,
    GetSleeperMatchupsTool,
    WebSearchTool,
  ],
  exports: [ToolsService],
})
export class ToolsModule {}
