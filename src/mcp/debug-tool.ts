import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';

@Injectable()
export class DebugTool {
    constructor(private readonly sleeperService: SleeperService) {}

    @Tool({
        name: 'debug-user-data',
        description: 'Debug tool to check if user data can be retrieved and identify issues',
        parameters: z.object({
            username: z.string().describe('The username to debug'),
        })
    })
    async debugUserData({ username }): Promise<string> {
        try {
            const debugInfo: any = {
                step: 'Starting debug',
                username: username,
                results: {}
            };

            // Step 1: Try to get user info
            try {
                const user = await this.sleeperService.findUser({ username });
                debugInfo.results.user = {
                    success: true,
                    user_id: user.user_id,
                    display_name: user.display_name
                };
            } catch (error) {
                debugInfo.results.user = {
                    success: false,
                    error: error.message
                };
                return JSON.stringify(debugInfo);
            }

            // Step 2: Try to get leagues
            try {
                const user = await this.sleeperService.findUser({ username });
                const leagues = await this.sleeperService.findLeagues({ user_id: user.user_id });
                debugInfo.results.leagues = {
                    success: true,
                    count: leagues.length,
                    league_ids: leagues.map(l => l.league_id)
                };
            } catch (error) {
                debugInfo.results.leagues = {
                    success: false,
                    error: error.message
                };
            }

            // Step 3: Try to get NFL state
            try {
                const nflState = await this.sleeperService.findNflState();
                debugInfo.results.nfl_state = {
                    success: true,
                    week: nflState.week,
                    season: nflState.season
                };
            } catch (error) {
                debugInfo.results.nfl_state = {
                    success: false,
                    error: error.message
                };
            }

            return JSON.stringify(debugInfo, null, 2);
        } catch (error) {
            return JSON.stringify({ 
                error: `Debug failed: ${error.message}`,
                username: username 
            });
        }
    }
}
