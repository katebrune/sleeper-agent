import { Injectable } from "@nestjs/common";
import { z } from 'zod'
import { Tool } from "./abstract.tool";
import { ToolFn } from "src/openai/openai.types";
import { SleeperService } from "src/sleeper/sleeper.service";

const getSleeperMatchupsArgs = z.object({
    league_id: z.string().describe('The id of the sleeper league to retreive all rosters for'),
    week: z.string().describe('The week of the nfl season to get the sleeper fantasy matchups for')
})

type Args = z.infer<typeof getSleeperMatchupsArgs>

@Injectable()
export class GetSleeperMatchupsTool extends Tool<Args> {
    constructor(
        private readonly sleeperService: SleeperService
    ){
        super({
            name: 'get_sleeper_matchups',
            description: 'Get all sleeper fantasy matchups for a specific league and specific week.',
            parameters: getSleeperMatchupsArgs
        })
    }

    execute: ToolFn<Args, string> = async ({ toolArgs }): Promise<string> => {
        try {
            const data = await this.sleeperService.findMatchups({ league_id: toolArgs.league_id, week: toolArgs.week })
            return JSON.stringify(data)
        } catch (error) {
            return `Somethign went wrong when trying to get matchup information about ${toolArgs.league_id} for week ${toolArgs.week}`
        }
    }
}