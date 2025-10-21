import { Injectable } from "@nestjs/common";
import { z } from 'zod'
import { Tool } from "./abstract.tool";
import { ToolFn } from "src/openai/openai.types";
import { SleeperService } from "src/sleeper/sleeper.service";

const getSleeperRostersArsgs = z.object({
    league_id: z.string().describe('The id of the sleeper league to retreive all rosters for')
})

type Args = z.infer<typeof getSleeperRostersArsgs>

@Injectable()
export class GetSleeperRostersTool extends Tool<Args> {
    constructor(
        private readonly sleeperService: SleeperService
    ){
        super({
            name: 'get_sleeper_rosters',
            description: 'Get all sleeper rosters for a specific league. Each roster is associated with a user via the owner_id, which maps to a users user_id',
            parameters: getSleeperRostersArsgs
        })
    }

    execute: ToolFn<Args, string> = async ({ toolArgs }): Promise<string> => {
        try {
            const data = await this.sleeperService.findRosters({ league_id: toolArgs.league_id })
            return JSON.stringify(data)
        } catch (error) {
            return `Somethign went wrong when trying to get roster information about ${toolArgs.league_id}`
        }
    }
}