import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LowDBService } from 'src/lowdb/lowdb.service';
import { OpenAIService } from 'src/openai/openai.service';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly lowdbService: LowDBService,
    private readonly openaiService: OpenAIService,
    private readonly toolsService: ToolsService,
  ) {}

  async run(userMessage: string) {
    await this.lowdbService.addMessages([
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    while (true) {
      const history = await this.lowdbService.getMessages();
      const response = await this.openaiService.runLLM({ messages: history });
      await this.lowdbService.addMessages([response]);

      if (response.content) {
        // return this.lowdbService.getMessages();
        return response.content;
      }

      if (response.tool_calls) {
        for (const toolCall of response.tool_calls) {
          const toolResponse = await this.toolsService.runTool(
            toolCall as OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall,
            userMessage,
          );
          await this.lowdbService.saveToolResponse(toolCall.id, toolResponse);
        }
      }
    }
  }
}
