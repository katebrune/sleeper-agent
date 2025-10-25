import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';

@Injectable()
export class GetSleeperRostersTool {
    constructor(private readonly sleeperService: SleeperService){}

    @Tool({
        name: 'get-sleeper-rosters-tool',
        description: 'Get all sleeper rosters for a specific league',
        parameters: z.object({
            league_id: z.string().describe('The id of the sleeper league to retreive all rosters for'),
        })
    })
    async getSleeperRosters({ league_id }): Promise<string> {
        try {
            const data = await this.sleeperService.findRosters({
                league_id: league_id,
            })
            return JSON.stringify(data)
        } catch {
            return 'Error getting sleeper rosters'
        }
    }
}