import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Tool } from './abstract.tool';
import { ToolFn } from 'src/openai/openai.types';
import { SleeperService } from 'src/sleeper/sleeper.service';

const getSleeperUserInfoArgs = z.object({
  username: z.string().describe('The username of the sleeper user'),
});

type Args = z.infer<typeof getSleeperUserInfoArgs>;

@Injectable()
export class GetSleeperUserInfoTool extends Tool<Args> {
  constructor(private readonly sleeperService: SleeperService) {
    super({
      name: 'get_sleeper_user_info',
      description: 'Get sleeper info for a specific user',
      parameters: getSleeperUserInfoArgs,
    });
  }

  execute: ToolFn<Args, string> = async ({ toolArgs }): Promise<string> => {
    try {
      const data = await this.sleeperService.findUser({
        username: toolArgs.username,
      });
      return JSON.stringify(data);
    } catch (error) {
      return `Something went wrong when trying to get information about ${toolArgs.username}: ${error}`;
    }
  };
}
