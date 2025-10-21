import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import type {
    FindLeaguesArgs,
    FindMatchupsArgs,
    FindRostersArgs,
    FindUserArgs,
    SleeperLeague,
    SleeperMatchup,
    SleeperNflState,
    SleeperPlayer,
    SleeperRoster,
    SleeperUser   
} from './sleeper.types'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class SleeperService {
    constructor(private readonly httpService: HttpService){}


    async findUser(args: FindUserArgs): Promise<SleeperUser> {
        const observable = this.httpService.get(`https://api.sleeper.app/v1/user/${args.username}`).pipe(
            map(response => response.data)
        )
        return await lastValueFrom(observable)
    }

    async findLeagues(args: FindLeaguesArgs): Promise<SleeperLeague[]> {
        const observable = this.httpService.get(`https://api.sleeper.app/v1/user/${args.user_id}/leagues/nfl/2025`).pipe(
            map(response => response.data)
        )
        return await lastValueFrom(observable)
    }

    async findRosters(args: FindRostersArgs): Promise<SleeperRoster[]> {
        const observable = this.httpService.get(`https://api.sleeper.app/v1/league/${args.league_id}/rosters`).pipe(
            map(response => response.data)
        )
        return await lastValueFrom(observable)
    }

    async findMatchups(args: FindMatchupsArgs): Promise<SleeperMatchup[]> {
        const observable = this.httpService.get(`https://api.sleeper.app/v1/league/${args.league_id}/matchups/${args.week}`).pipe(
            map(response => response.data)
        )
        return await lastValueFrom(observable)
    }

    async findNflState(): Promise<SleeperNflState> {
        const observable = this.httpService.get(`https://api.sleeper.app/v1/state/nfl`).pipe(
            map(response => response.data)
        )
        return await lastValueFrom(observable)
    }

    async findAllPlayers(): Promise<{[key: string]: SleeperPlayer}>{
        const observable = this.httpService.get(`https://api.sleeper.app/v1/players/nfl`).pipe(
            map(response => response.data)
        )
        return await lastValueFrom(observable)
    }
}