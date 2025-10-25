import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ResponseCreateParamsBase } from 'openai/resources/responses/responses.js';
import { SystemPromptService } from 'src/system-prompt/system-prompt.service';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(
    private readonly systemPromptService: SystemPromptService,
  ) {
    this.client = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }

  async createResponse(input: OpenAI.Responses.ResponseInputItem[]): Promise<OpenAI.Responses.Response>{
    const response = await this.client.responses.create({
      input: input,
      instructions: this.systemPromptService.getPrompt(),
      model: 'gpt-4o-mini',
      temperature: 0.1,
      tools: [
        { type: 'web_search' },
        {
          type: 'mcp',
          server_label: 'sleeper-agent-mcp',
          server_description: 'A Sleeper MCP server to assist with fantasy football questions',
          server_url: process.env['SLEEPER_MCP_URL'],
          require_approval: 'never'
        }
      ],
      tool_choice: 'auto',
      parallel_tool_calls: false,
    });

    return response
  }
}
