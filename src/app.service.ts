import { Injectable } from '@nestjs/common';
import { LowDBService } from './lowdb/lowdb.service';
import { SleeperService } from './sleeper/sleeper.service';
import { SleeperPlayer } from './sleeper/sleeper.types';

@Injectable()
export class AppService {
  constructor(
    private readonly lowdbService: LowDBService,
    private readonly sleeperService: SleeperService,
  ) {}

  async seedPlayersData(): Promise<void> {
    const players = await this.sleeperService.findAllPlayers();
    await this.lowdbService.addPlayers(players);
  }

  async getPlayer(playerId: string): Promise<SleeperPlayer> {
    return this.lowdbService.getAPlayer(playerId);
  }
}
