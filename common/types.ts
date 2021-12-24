export type TPlayerID = string;
export type TGameID = string;
export type TMatchID = string;
export type PlayingCardSuite = 0 | 1 | 2 | 3;
export type PlayingCardRank =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export type TeamIndex = 0 | 1;
export type PlayerIndex = 0 | 1 | 2 | 3;
export type PlayingCard =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51;

export type TGameStatus =
  | "awaiting_players"
  | "awaiting_trump_suite"
  | "in_play"
  | "finished";

export type TGameData = {
  // status reflecting the stage at which the game is at
  game_status: TGameStatus;

  // list of player names
  players: string[],

  // index of the player to play next
  whos_turn: PlayerIndex | null;

  // index of the admin player
  whos_admin: PlayerIndex;

  // index of the lead player (hakem)
  whos_lead: PlayerIndex;

  // index of the player whose requested this data
  your_index: PlayerIndex;

  // current cards in hands of the player whose requested this data
  your_cards: PlayingCard[];

  // cards currently on the floor
  floor_cards: PlayingCard[];

  // floor suite (indicated by the first card played on this round — on the floor)
  floor_suite: PlayingCardSuite | null;

  // trump suite — as chosen by the starting player of this game
  trump_suite: PlayingCardSuite | null;

  // wins per team — array of length two indicating number of wins by each team
  wins: [number, number];

  // score lines including this game and previous games
  scoreline: [number, number];

  // list of all tricks played
  tricks: TTrick[],

  // link to next game
  next_game_id: TGameID | null,
};

export type TTrick = {
  cards: PlayingCard[]; // limit to length 4?
  starting_player: PlayerIndex,
  winner: PlayerIndex;
};

type TMatchFinishedGameState = {
  id: TGameID,
  winner_team: TeamIndex,
  wins: [number, number],
  scoreline: [number, number],
};

type TMatchCurrentGameState = {
  id: TGameID,
  status: TGameStatus,
  wins: [number, number]
};

export type TMatchData = {
  finished_games: TMatchFinishedGameState[],
  current_game?: TMatchCurrentGameState,
}
