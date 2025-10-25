import type OpenAI from 'openai';
import type { SleeperPlayer } from 'src/sleeper/sleeper.types';

export type Data = {
  messages: MessageWithMetadata[];
  players: { [key: string]: SleeperPlayer };
};

export type AIMessage = OpenAI.Responses.ResponseInputItem

export type MessageWithMetadata = AIMessage & {
  _id: string;
  _createdAt: string;
};

