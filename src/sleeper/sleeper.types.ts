export type FindUserArgs = {
  username: string;
};

export type SleeperUser = {
  username: string;
  user_id: string;
  display_name: string;
  avatar: string;
};

export type FindLeaguesArgs = {
  user_id: string;
};

export type SleeperLeague = {
  total_rosters: number;
  status: string;
  sport: string;
  settings: object;
  season_type: string;
  season: string;
  scoring_settings: object;
  roster_positions: [];
  previous_league_id: string;
  name: string;
  league_id: string;
  draft_id: string;
  avatar: string;
};

export type FindRostersArgs = {
  league_id: string;
};

export type SleeperRoster = {
  starters: string[];
  settings: {
    winds: number;
    waiver_position: number;
    total_moves: number;
    ties: number;
    losses: number;
    fpts_decimal: number;
    fpts_against_decimal: number;
    fpts_against: number;
    fpts: number;
  };
  roster_id: number;
  reserve: string[];
  players: string[];
  owner_id: string;
  league_id: string;
};

export type FindMatchupsArgs = {
  league_id: string;
  week: string;
};

export type SleeperMatchup = {
  starters: string[];
  roster_id: number;
  players: string[];
  matchup_id: number;
  points: number;
  custom_points: null;
};

export type SleeperNflState = {
  week: number;
  season_type: string;
  season_start_date: string;
  season: string;
  previous_season: string;
  leg: number;
  league_season: string;
  league_create_season: string;
  display_week: number;
};

export type SleeperPlayer = {
  hashtag: string;
  depth_chart_position: number;
  status: string;
  sport: string;
  fantasy_positions: string[];
  number: number;
  search_last_name: string;
  injury_start_date: string | null;
  weight: string;
  position: string;
  practice_participation: string | null;
  sportradar_id: string;
  team: string;
  last_name: string;
  college: string;
  fantasy_data_id: number;
  injury_status: string | null;
  player_id: string;
  height: string;
  search_full_name: string;
  age: number;
  stats_id: string;
  birth_country: string;
  espn_id: string;
  search_rank: number;
  first_name: string;
  depth_chart_order: number;
  years_exp: number;
  rotowire_id: string | null;
  rotoworld_id: number | null;
  search_first_name: string;
  yahoo_id: string | null;
};
