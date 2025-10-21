import { Module } from '@nestjs/common'
import { OpenAIService } from './openai.service'
import { SystemPromptModule } from 'src/system-prompt/system-prompt.module'
import { ToolsModule } from 'src/tools/tools.module'

@Module({
    imports: [SystemPromptModule, ToolsModule],
    controllers: [],
    providers: [OpenAIService],
    exports: [OpenAIService]
})
export class OpenAIModule {}