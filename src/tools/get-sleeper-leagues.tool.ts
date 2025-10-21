import { Injectable } from "@nestjs/common";
import { z } from 'zod'
import { Tool } from "./abstract.tool";
import { ToolFn } from "src/openai/openai.types";
import { SleeperService } from "src/sleeper/sleeper.service";

const getSleeperLeaguesArgs = z.object({
    user_id: z.string().describe('The user id of the sleeper user to retrieve leagues for')
})

type Args = z.infer<typeof getSleeperLeaguesArgs>

@Injectable()
export class GetSleeperLeaguesTool extends Tool<Args> {
    constructor(
        private readonly sleeperService: SleeperService
    ){
        super({
            name: 'get_sleeper_leagues',
            description: 'Get all sleeper leagues that a specific user is part of',
            parameters: getSleeperLeaguesArgs
        })
    }

    execute: ToolFn<Args, string> = async ({ toolArgs }): Promise<string> => {
        try {
            const data = await this.sleeperService.findLeagues({ user_id: toolArgs.user_id })
            return JSON.stringify(data)
        } catch (error) {
            return `Something went wrong when trying to get league information for ${toolArgs.user_id}`
        }
    }
}