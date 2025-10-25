import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { SystemPromptModule } from 'src/system-prompt/system-prompt.module';

@Module({
  imports: [SystemPromptModule],
  controllers: [],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
