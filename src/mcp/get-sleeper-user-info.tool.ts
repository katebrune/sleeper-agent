import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';

@Injectable()
export class GetSleeperUserInfoTool {
    constructor(private readonly sleeperService: SleeperService){}

    @Tool({
        name: 'get-sleeper-user-by-username-tool',
        description: 'Get information about a specific sleeper user by their username',
        parameters: z.object({
            username: z.string().describe('The username of the sleeper user'),
        })
    })
    async getSleeperUserInfo({ username }): Promise<string> {
        try {
            const data = await this.sleeperService.findUser({
                username: username,
            })
            return JSON.stringify(data)
        } catch {
            return 'Error getting sleeper user info'
        }
    }

    @Tool({
        name: 'get-sleeper-user-by-id-tool',
        description: 'Get information about a specific sleeper user by their user id',
        parameters: z.object({
            user_id: z.string().describe('The user id of the sleeper user'),
        })
    })
    async getSleeperUserById({ user_id }): Promise<string> {
        try {
            const data = await this.sleeperService.findUser({
                username: user_id
            })
            return JSON.stringify(data)
        } catch {
            return 'Error getting sleeper user by id'
        }
    }
}