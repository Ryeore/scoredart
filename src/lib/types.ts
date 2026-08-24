export type GameType = 301 | 501 | 701;

export interface GameSettings {
  gameType: GameType;
  doubleOut: boolean;
  playerNames: string[];
}

export interface Throw {
  /** base segment value: 1-20, 25 (bull), or 0 (miss) */
  value: number;
  multiplier: 1 | 2 | 3;
  points: number;
  label: string;
}

export interface Turn {
  throws: Throw[];
  scoreAfter: number;
  busted: boolean;
}

export interface PlayerState {
  name: string;
  score: number;
  turns: Turn[];
}

export interface GameState {
  settings: GameSettings;
  players: PlayerState[];
  currentPlayerIndex: number;
  currentTurnThrows: Throw[];
  winnerIndex: number | null;
  message: string | null;
}
