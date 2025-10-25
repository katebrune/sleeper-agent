import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';

@Injectable()
export class GetNflStateTool {
    constructor(private readonly sleeperService: SleeperService){}

    @Tool({
        name: 'get-nfl-state-tool',
        description: 'Get the current state of the nfl, with stats like week, season, etc',
        parameters: z.object({})
    })
    async getNflState(): Promise<string> {
        try {
            const data = await this.sleeperService.findNflState()
            return JSON.stringify(data)
        } catch {
            return 'Error getting nfl state'
        }
    }
}