import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Tool } from './abstract.tool';
import { GetSleeperUserInfoTool } from './get-sleeper-user-info.tool';
import { GetSleeperLeaguesTool } from './get-sleeper-leagues.tool';
import { GetSleeperRostersTool } from './get-sleeper-rosters.tool';
import { GetSleeperPlayersTool } from './get-sleeper-players.tool';
import { GetNflStateTool } from './get-nfl-state.tool';
import { GetSleeperMatchupsTool } from './get-sleeper-matchups.tool';

@Injectable()
export class ToolsService {
  private tools: Map<string, Tool<unknown>> = new Map();

  constructor(
    private readonly getSleeperUserInfoTool: GetSleeperUserInfoTool,
    private readonly getSleeperLeaguesTool: GetSleeperLeaguesTool,
    private readonly getSleeperRostersTool: GetSleeperRostersTool,
    private readonly getSleeperPlayersTool: GetSleeperPlayersTool,
    private readonly getNflStateTool: GetNflStateTool,
    private readonly getSleeperMatchupsTool: GetSleeperMatchupsTool,
  ) {
    this.tools.set(
      this.getSleeperUserInfoTool.name,
      this.getSleeperUserInfoTool,
    );
    this.tools.set(this.getSleeperLeaguesTool.name, this.getSleeperLeaguesTool);
    this.tools.set(this.getSleeperRostersTool.name, this.getSleeperRostersTool);
    this.tools.set(this.getSleeperPlayersTool.name, this.getSleeperPlayersTool);
    this.tools.set(this.getNflStateTool.name, this.getNflStateTool);
    this.tools.set(
      this.getSleeperMatchupsTool.name,
      this.getSleeperMatchupsTool,
    );
  }

  getTools(): OpenAI.Chat.Completions.ChatCompletionTool[] {
    return Array.from(this.tools.values()).map((tool) => tool.tool);
  }

  runTool(
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall,
    userMessage: string,
  ) {
    const input = {
      userMessage,
      toolArgs: JSON.parse(toolCall.function.arguments || '{}') as Record<
        string,
        unknown
      >,
    };

    const toolName = toolCall.function.name;
    const tool = this.tools.get(toolName);

    if (!tool) {
      return `never run this tool ${toolName} again, or else`;
    }

    return tool.execute(input);
  }
}
