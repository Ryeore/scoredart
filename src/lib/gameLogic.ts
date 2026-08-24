import type { GameSettings, GameState, PlayerState, Throw } from "./types";

const MAX_DARTS_PER_TURN = 3;

export function createInitialGameState(settings: GameSettings): GameState {
  const players: PlayerState[] = settings.playerNames.map((name) => ({
    name,
    score: settings.gameType,
    turns: [],
  }));

  return {
    settings,
    players,
    currentPlayerIndex: 0,
    currentTurnThrows: [],
    winnerIndex: null,
    message: null,
  };
}

export function isDoubleThrow(t: Throw): boolean {
  return t.multiplier === 2;
}

/** Adds a dart to the current (unconfirmed) turn. Does not affect scores yet. */
export function registerThrow(state: GameState, thrownDart: Throw): GameState {
  if (state.winnerIndex !== null) return state;
  if (state.currentTurnThrows.length >= MAX_DARTS_PER_TURN) return state;

  return {
    ...state,
    currentTurnThrows: [...state.currentTurnThrows, thrownDart],
    message: null,
  };
}

/** Replaces a single dart within the current (unconfirmed) turn. */
export function editThrowAt(state: GameState, index: number, newThrow: Throw): GameState {
  if (state.winnerIndex !== null) return state;
  if (index < 0 || index >= state.currentTurnThrows.length) return state;

  return {
    ...state,
    currentTurnThrows: state.currentTurnThrows.map((t, i) => (i === index ? newThrow : t)),
  };
}

interface TurnOutcome {
  finalScore: number;
  busted: boolean;
  won: boolean;
}

/** Applies darts in order against a starting score, stopping at the first bust or checkout. */
function evaluateTurn(startScore: number, throws: Throw[], doubleOut: boolean): TurnOutcome {
  let score = startScore;

  for (const t of throws) {
    const remaining = score - t.points;
    const busted =
      remaining < 0 ||
      remaining === 1 ||
      (remaining === 0 && doubleOut && !isDoubleThrow(t));

    if (busted) return { finalScore: startScore, busted: true, won: false };

    score = remaining;
    if (score === 0) return { finalScore: score, busted: false, won: true };
  }

  return { finalScore: score, busted: false, won: false };
}

/** Commits the current turn's darts to the active player and advances to the next player. */
export function confirmTurn(state: GameState): GameState {
  if (state.winnerIndex !== null || state.currentTurnThrows.length === 0) return state;

  const idx = state.currentPlayerIndex;
  const player = state.players[idx];
  const outcome = evaluateTurn(player.score, state.currentTurnThrows, state.settings.doubleOut);

  const players = [...state.players];
  players[idx] = {
    ...player,
    score: outcome.finalScore,
    turns: [
      ...player.turns,
      { throws: state.currentTurnThrows, scoreAfter: outcome.finalScore, busted: outcome.busted },
    ],
  };

  if (outcome.won) {
    return {
      ...state,
      players,
      currentTurnThrows: [],
      winnerIndex: idx,
      message: `${player.name} wins!`,
    };
  }

  return {
    ...state,
    players,
    currentPlayerIndex: (idx + 1) % players.length,
    currentTurnThrows: [],
    message: outcome.busted ? "Bust!" : null,
  };
}
