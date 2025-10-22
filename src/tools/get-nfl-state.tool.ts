import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Tool } from './abstract.tool';
import { ToolFn } from 'src/openai/openai.types';
import { SleeperService } from 'src/sleeper/sleeper.service';

const getNflStateArgs = z.object({});

type Args = z.infer<typeof getNflStateArgs>;

@Injectable()
export class GetNflStateTool extends Tool<Args> {
  constructor(private readonly sleeperService: SleeperService) {
    super({
      name: 'get_nfl_state',
      description:
        'Get the current state of the nfl, with stats like week, season, etc',
      parameters: getNflStateArgs,
    });
  }

  execute: ToolFn<Args, string> = async (): Promise<string> => {
    try {
      const data = await this.sleeperService.findNflState();
      return JSON.stringify(data);
    } catch (error) {
      return `Something went wrong trying to get the nfl state: ${error}`;
    }
  };
}
