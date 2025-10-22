import { Module } from '@nestjs/common';
import { SystemPromptService } from './system-prompt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SystemPromptService],
  exports: [SystemPromptService],
})
export class SystemPromptModule {}
