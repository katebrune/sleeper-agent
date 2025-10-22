import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class WebSearchService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }

  async runWebSearch(query: string) {
    const response = await this.client.responses.create({
      model: 'gpt-4o-mini',
      input: query,
      tools: [{ type: 'web_search' }],
    });
    return response.output_text;
  }
}
