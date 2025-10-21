import OpenAI from 'openai'
import { zodFunction } from 'openai/helpers/zod.mjs'
import { ToolFn } from 'src/openai/openai.types'
import { z } from 'zod'

const toolArgs = z.object({
    name: z.string().describe('the name of the tool'),
    description: z.string().describe('a description of the tool'),
    parameters: z.any()
})

type Args = z.infer<typeof toolArgs>

export abstract class Tool<T> {
    protected _name: string
    protected _description: string
    protected _parameters: z.ZodSchema<T>

    constructor(args: Args) {
        this._name = args.name
        this._description = args.description
        this._parameters = args.parameters as z.ZodSchema<T>
    }

    get name(): string {
        return this._name
    }

    get tool(): OpenAI.Chat.Completions.ChatCompletionTool {
        return zodFunction({
            name: this.name,
            description: this._description,
            parameters: this._parameters
        })
    }

    abstract execute: ToolFn<T, string>
}