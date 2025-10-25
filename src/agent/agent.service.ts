import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LowDBService } from 'src/lowdb/lowdb.service';
import { OpenAIService } from 'src/openai/openai.service';

@Injectable()
export class AgentService {
  constructor(
    private readonly lowdbService: LowDBService,
    private readonly openaiService: OpenAIService,
  ) {}

  async run (userMessage: string) {
    await this.lowdbService.addMessages([
      {
        role: 'user',
        content: userMessage,
      },
    ]);
    const history = await this.lowdbService.getMessages();
    const response = await this.openaiService.createResponse(history)
    await this.lowdbService.addMessages([
      {
        role: 'assistant',
        content: response.output_text
      }
    ])
    return response.output_text
  }
}
