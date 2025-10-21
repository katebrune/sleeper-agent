import { Injectable } from '@nestjs/common'
import { LowDBService } from 'src/lowdb/lowdb.service';
import { OpenAIService } from 'src/openai/openai.service';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class AgentService {
    constructor(
        private readonly lowdbService: LowDBService,
        private readonly openaiService: OpenAIService,
        private readonly toolsService: ToolsService
    ){}

    async run(userMessage: string){
        await this.lowdbService.addMessages([{
            role: 'user',
            content: userMessage
        }])

        while (true) {
            const history = await this.lowdbService.getMessages()
            const response = await this.openaiService.runLLM({ messages: history })
            await this.lowdbService.addMessages([response])

            if (response.content) {
                // log message
                return this.lowdbService.getMessages()
            }

            if (response.tool_calls) {
                // log message

                for (const toolCall of response.tool_calls) {
                    const toolResponse = await this.toolsService.runTool(toolCall, userMessage)
                    await this.lowdbService.saveToolResponse(toolCall.id, toolResponse)
                }
            }
        }
    }
}