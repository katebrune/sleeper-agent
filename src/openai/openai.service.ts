import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AIMessage } from './openai.types';
import { SystemPromptService } from 'src/system-prompt/system-prompt.service';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(
    private readonly systemPromptService: SystemPromptService,
    private readonly toolsService: ToolsService,
  ) {
    this.client = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }

  async runLLM({ messages }: { messages: AIMessage[] }) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        { role: 'system', content: this.systemPromptService.getPrompt() },
        ...messages,
      ],
      tools: this.toolsService.getTools(),
      tool_choice: 'auto',
      parallel_tool_calls: false,
    });

    return response.choices[0].message;
  }
}
