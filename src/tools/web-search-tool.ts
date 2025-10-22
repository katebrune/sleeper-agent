import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Tool } from './abstract.tool';
import { ToolFn } from 'src/openai/openai.types';
import { WebSearchService } from 'src/web-search/web-search.service';

const webSearchArgs = z.object({
  query: z.string().describe('The query to search the web for'),
});

type Args = z.infer<typeof webSearchArgs>;

@Injectable()
export class WebSearchTool extends Tool<Args> {
  constructor(private readonly webSearchService: WebSearchService) {
    super({
      name: 'web_search',
      description: 'Search the web for information',
      parameters: webSearchArgs,
    });
  }

  execute: ToolFn<Args, string> = async ({ toolArgs }): Promise<string> => {
    return await this.webSearchService.runWebSearch(toolArgs.query);
  };
}
