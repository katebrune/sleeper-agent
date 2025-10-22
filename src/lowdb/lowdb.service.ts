import { Injectable } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';
import type { Low } from 'lowdb';
import { v4 as uuidv4 } from 'uuid';
import type { Data, MessageWithMetadata } from './lowdb.types';
import { AIMessage } from 'src/openai/openai.types';
import { SleeperPlayer } from 'src/sleeper/sleeper.types';

@Injectable()
export class LowDBService {
  private filename: string;
  private defaultValues: Data;

  constructor() {
    this.filename = 'db.json';
    this.defaultValues = {
      messages: [],
      players: {},
    };
  }

  async getDb(): Promise<Low<Data>> {
    return await JSONFilePreset<Data>(this.filename, this.defaultValues);
  }

  private addMetadata(message: AIMessage): MessageWithMetadata {
    return {
      ...message,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
  }

  private removeMetadata(message: MessageWithMetadata): AIMessage {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = message;
    return rest;
  }

  async addMessages(messages: AIMessage[]): Promise<void> {
    const db = await this.getDb();
    db.data.messages.push(
      ...messages.map((message) => this.addMetadata(message)),
    );
    await db.write();
  }

  async getMessages(): Promise<AIMessage[]> {
    const db = await this.getDb();
    return db.data.messages.map((message) => this.removeMetadata(message));
  }

  async saveToolResponse(toolCallId: string, toolResponse: string) {
    return this.addMessages([
      {
        role: 'tool',
        content: toolResponse,
        tool_call_id: toolCallId,
      },
    ]);
  }

  async addPlayers(players: { [key: string]: SleeperPlayer }): Promise<void> {
    const db = await this.getDb();
    db.data.players = { ...db.data.players, ...players };
    await db.write();
  }

  async getAPlayer(playerId: string): Promise<SleeperPlayer> {
    const db = await this.getDb();
    return db.data.players[playerId];
  }
}
