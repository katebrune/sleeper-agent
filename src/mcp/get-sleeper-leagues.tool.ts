import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';

@Injectable()
export class GetSleeperLeaguesTool {
    constructor(private readonly sleeperService: SleeperService){}

    @Tool({
        name: 'get-sleeper-leagues-tool',
        description: 'Get all sleeper leagues that a specific user is part of',
        parameters: z.object({
            user_id: z.string().describe('The user id of the sleeper user to retrieve leagues for'),
        })
    })
    async getSleeperLeagues({ user_id }): Promise<string> {
        try {
            const data = await this.sleeperService.findLeagues({
                user_id: user_id,
            })
            return JSON.stringify(data)
        } catch {
            return 'Error getting sleeper leagues'
        }
    }
}