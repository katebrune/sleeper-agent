import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SleeperService } from 'src/sleeper/sleeper.service';
import { LowDBService } from 'src/lowdb/lowdb.service';
import { SleeperPlayer } from 'src/sleeper/sleeper.types';

@Injectable()
export class FantasyAnalysisTool {
    constructor(
        private readonly sleeperService: SleeperService,
        private readonly lowdbService: LowDBService
    ) {}

    @Tool({
        name: 'analyze-user-league',
        description: 'Get complete analysis of a user\'s fantasy league including league settings, rosters, matchups, and player details',
        parameters: z.object({
            username: z.string().describe('The username of the sleeper user to analyze'),
        })
    })
    async analyzeUserLeague({ username }): Promise<string> {
        try {
            // Get NFL state first
            const nflState = await this.sleeperService.findNflState();
            const currentWeek = nflState.week;
            const currentSeason = nflState.season;

            // Get user info
            const user = await this.sleeperService.findUser({ username });
            const userId = user.user_id;

            // Get user's leagues
            const leagues = await this.sleeperService.findLeagues({ user_id: userId });
            
            if (leagues.length === 0) {
                return JSON.stringify({ error: 'No leagues found for user' });
            }

            // Get the first league (or you could make this configurable)
            const league = leagues[0];
            const leagueId = league.league_id;

            // Get league rosters
            const rosters = await this.sleeperService.findRosters({ league_id: leagueId });

            // Get current week matchups
            const matchups = await this.sleeperService.findMatchups({ 
                league_id: leagueId, 
                week: currentWeek.toString() 
            });

            // Find user's roster
            const userRoster = rosters.find(roster => roster.owner_id === userId);
            if (!userRoster) {
                return JSON.stringify({ error: 'User roster not found' });
            }

            // Get all players on the roster
            const allRosterPlayers = userRoster.players ? userRoster.players.filter(id => id && id !== '') : [];
            
            // Calculate bench players (players not in starters, reserve, or taxi)
            const starters = userRoster.starters || [];
            const reserve = userRoster.reserve || [];
            const taxi = userRoster.taxi || [];
            
            console.log('Roster data:', {
                allPlayers: allRosterPlayers.length,
                starters: starters.length,
                reserve: reserve.length,
                taxi: taxi.length
            });
            
            const benchPlayers = allRosterPlayers.filter(playerId => 
                !starters.includes(playerId) && 
                !reserve.includes(playerId) && 
                !taxi.includes(playerId)
            );

            // Get player details for all roster players
            const players: SleeperPlayer[] = [];
            for (const playerId of allRosterPlayers) {
                try {
                    const player = await this.lowdbService.getAPlayer(playerId);
                    players.push(player);
                } catch (error) {
                    console.log(`Player ${playerId} not found in database`);
                }
            }

            // Find user's current matchup
            const userMatchup = matchups.find(matchup => 
                matchup.roster_id === userRoster.roster_id
            );

            // Get opponent info if matchup exists
            let opponentInfo: any = null;
            if (userMatchup) {
                const opponentRoster = rosters.find(roster => 
                    roster.roster_id === userMatchup.matchup_id
                );
                if (opponentRoster) {
                    // Get opponent username
                    try {
                        const opponentUser = await this.sleeperService.findUser({ 
                            username: opponentRoster.owner_id 
                        });
                        opponentInfo = {
                            username: opponentUser.username,
                            display_name: opponentUser.display_name,
                            roster_id: opponentRoster.roster_id,
                            starters: opponentRoster.starters,
                            points: userMatchup.points
                        };
                    } catch (error) {
                        opponentInfo = {
                            username: 'Unknown',
                            display_name: 'Unknown',
                            roster_id: opponentRoster.roster_id,
                            starters: opponentRoster.starters,
                            points: userMatchup.points
                        };
                    }
                }
            }

            // Build comprehensive analysis
            const analysis = {
                nfl_state: {
                    week: currentWeek,
                    season: currentSeason
                },
                user: {
                    username: user.username,
                    display_name: user.display_name,
                    user_id: user.user_id
                },
                league: {
                    league_id: league.league_id,
                    name: league.name,
                    season: league.season,
                    status: league.status,
                    settings: {
                        roster_positions: league.roster_positions,
                        total_rosters: league.total_rosters,
                        playoff_teams: league.playoff_teams
                    }
                },
                user_roster: {
                    roster_id: userRoster.roster_id,
                    starters: starters,
                    bench: benchPlayers,       // Calculated bench players (not in starters/reserve/taxi)
                    reserve: reserve,          // IR players
                    taxi: taxi,               // Taxi squad players
                    players: players,
                    points: userMatchup?.points || 0,
                    bench_players: benchPlayers,
                    reserve_players: reserve.filter(id => id && id !== ''),
                    taxi_players: taxi.filter(id => id && id !== ''),
                    starter_players: starters.filter(id => id && id !== '')
                },
                current_matchup: {
                    week: currentWeek,
                    opponent: opponentInfo,
                    user_points: userMatchup?.points || 0,
                    opponent_points: userMatchup?.matchup_id ? 
                        matchups.find(m => m.roster_id === userMatchup.matchup_id)?.points || 0 : 0
                },
                all_rosters: rosters.map(roster => ({
                    roster_id: roster.roster_id,
                    owner_id: roster.owner_id,
                    starters: roster.starters,
                    reserve: roster.reserve
                }))
            };

            return JSON.stringify(analysis, null, 2);
        } catch (error) {
            return JSON.stringify({ 
                error: `Error analyzing user league: ${error.message}`,
                username: username,
                suggestion: "Try using the debug tool to identify the specific issue"
            });
        }
    }

    @Tool({
        name: 'get-league-standings',
        description: 'Get complete league standings with team names, records, and rosters',
        parameters: z.object({
            league_id: z.string().describe('The league ID to get standings for'),
        })
    })
    async getLeagueStandings({ league_id }): Promise<string> {
        try {
            // Get league info
            const leagues = await this.sleeperService.findLeagues({ user_id: 'dummy' });
            const league = leagues.find(l => l.league_id === league_id);
            
            if (!league) {
                return JSON.stringify({ error: 'League not found' });
            }

            // Get rosters
            const rosters = await this.sleeperService.findRosters({ league_id });

            // Get current week matchups
            const nflState = await this.sleeperService.findNflState();
            const matchups = await this.sleeperService.findMatchups({ 
                league_id, 
                week: nflState.week.toString() 
            });

            // Build standings with team names
            const standings: any[]= [];
            for (const roster of rosters) {
                try {
                    const user = await this.sleeperService.findUser({ username: roster.owner_id });
                    const matchup = matchups.find(m => m.roster_id === roster.roster_id);
                    
                    standings.push({
                        roster_id: roster.roster_id,
                        username: user.username,
                        display_name: user.display_name,
                        wins: roster.settings?.wins || 0,
                        losses: roster.settings?.losses || 0,
                        ties: roster.settings?.ties || 0,
                        points_for: roster.settings?.fpts || 0,
                        points_against: roster.settings?.fpts_against || 0,
                        current_week_points: matchup?.points || 0,
                        starters: roster.starters,
                        reserve: roster.reserve
                    });
                } catch (error) {
                    standings.push({
                        roster_id: roster.roster_id,
                        username: 'Unknown',
                        display_name: 'Unknown',
                        wins: roster.settings?.wins || 0,
                        losses: roster.settings?.losses || 0,
                        ties: roster.settings?.ties || 0,
                        points_for: roster.settings?.fpts || 0,
                        points_against: roster.settings?.fpts_against || 0,
                        current_week_points: 0,
                        starters: roster.starters,
                        reserve: roster.reserve
                    });
                }
            }

            return JSON.stringify({
                league: {
                    name: league.name,
                    season: league.season,
                    week: nflState.week
                },
                standings: standings.sort((a, b) => (b.wins - a.wins) || (b.points_for - a.points_for))
            }, null, 2);
        } catch (error) {
            return JSON.stringify({ error: `Error getting league standings: ${error.message}` });
        }
    }
}
