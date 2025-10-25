import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { LowDBService } from 'src/lowdb/lowdb.service';
import { type SleeperPlayer } from 'src/sleeper/sleeper.types';

@Injectable()
export class GetSleeperPlayersTool {
    constructor(private readonly lowdbService: LowDBService){}

    @Tool({
        name: 'get-sleeper-players-tool',
        description: 'Get information about a list of sleeper players',
        parameters: z.object({
            player_ids: z.array(z.string()).describe('The ids of the sleeper players to get information about'),
        })
    })
    async getSleeperPlayers({ player_ids }): Promise<string> {
        try {
            const players: SleeperPlayer[] = [];
            for (const id of player_ids) {
                const result = await this.lowdbService.getAPlayer(id);
                players.push(result);
            }
            return JSON.stringify(players);
        } catch {
            return 'Error getting sleeper players'
        }
    }
}