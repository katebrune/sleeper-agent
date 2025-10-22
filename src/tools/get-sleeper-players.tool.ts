import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Tool } from './abstract.tool';
import { ToolFn } from 'src/openai/openai.types';
import { LowDBService } from 'src/lowdb/lowdb.service';
import { SleeperPlayer } from 'src/sleeper/sleeper.types';

const getSleeperPlayersArgs = z.object({
  player_ids: z
    .array(
      z
        .string()
        .describe(
          'A sleeper player id. E.g. "7549". These are available via rosters, in the players, starters, and reserve properties',
        ),
    )
    .min(1),
});

type Args = z.infer<typeof getSleeperPlayersArgs>;

@Injectable()
export class GetSleeperPlayersTool extends Tool<Args> {
  constructor(private readonly lowdbService: LowDBService) {
    super({
      name: 'get_sleeper_players',
      description: 'Get information about a list of sleeper players',
      parameters: getSleeperPlayersArgs,
    });
  }

  execute: ToolFn<Args, string> = async ({ toolArgs }): Promise<string> => {
    try {
      const players: SleeperPlayer[] = [];
      for (const id of toolArgs.player_ids) {
        const result = await this.lowdbService.getAPlayer(id);
        players.push(result);
      }
      return JSON.stringify(players);
    } catch (error) {
      return `Something went wrong when trying to get information about ${JSON.stringify(toolArgs.player_ids)}: ${error}`;
    }
  };
}
