import OpenAI from 'openai';
import { zodFunction } from 'openai/helpers/zod.mjs';
import { ToolFn } from 'src/openai/openai.types';
import { z } from 'zod';

type Args = {
  name: string;
  description: string;
  parameters: z.ZodSchema;
};

export abstract class Tool<T> {
  constructor(private readonly args: Args) {}

  get name(): string {
    return this.args.name;
  }

  get tool(): OpenAI.Chat.Completions.ChatCompletionTool {
    return zodFunction({
      name: this.args.name,
      description: this.args.description,
      parameters: this.args.parameters,
    });
  }

  abstract execute: ToolFn<T, string>;
}
