import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';

@Injectable()
export class GetSleeperMatchupsTool {
    constructor(private readonly sleeperService: SleeperService){}

    @Tool({
        name: 'get-sleeper-matchups-tool',
        description: 'Get all sleeper fantasy matchups for a specific league and specific week',
        parameters: z.object({
            league_id: z.string().describe('The id of the sleeper league to retreive all rosters for'),
            week: z.string().describe('The week of the nfl season to get the sleeper fantasy matchups for'),
        })
    })
    async getSleeperMatchups({ league_id, week }): Promise<string> {
        try {
            const data = await this.sleeperService.findMatchups({
                league_id: league_id,
                week: week,
            })
            return JSON.stringify(data)
        } catch {
            return 'Error getting sleeper matchups'
        }
    }
}