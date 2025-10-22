import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AIMessage } from './openai/openai.types';
import { AgentService } from './agent/agent.service';

class PromptDto {
  message: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly agentService: AgentService,
  ) {}

  @Post('seedplayers')
  async seedPlayersData(): Promise<void> {
    throw new Error('Data already seeded');
    await this.appService.seedPlayersData();
  }

  @Post('prompt')
  async prompt(@Body() promptDto: PromptDto): Promise<AIMessage[]> {
    const response = await this.agentService.run(promptDto.message);
    return response;
  }
}
