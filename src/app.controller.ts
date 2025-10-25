import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
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
  // eslint-disable-next-line @typescript-eslint/require-await
  async seedPlayersData(): Promise<void> {
    // this should only be called at most once a day
    throw new Error('Data already seeded');
    // await this.appService.seedPlayersData();
  }

  @Post('prompt')
  @HttpCode(HttpStatus.OK)
  async prompt(@Body() promptDto: PromptDto): Promise<string> {
    const response = await this.agentService.run(promptDto.message);
    return response;
  }
}
