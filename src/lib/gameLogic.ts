import type { GameSettings, GameState, PlayerState, Throw } from "./types";

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

/**
 * Registers a single dart throw for the current player and returns the
 * resulting state. Pure function - does not mutate the input state.
 */
export function registerThrow(state: GameState, thrownDart: Throw): GameState {
  if (state.winnerIndex !== null) return state;

  const player = state.players[state.currentPlayerIndex];
  const scoreBeforeTurn =
    player.score +
    state.currentTurnThrows.reduce((sum, t) => sum + t.points, 0);
  const remaining = player.score - thrownDart.points;
  const turnThrows = [...state.currentTurnThrows, thrownDart];

  const isLastDartOfTurn = turnThrows.length >= 3;
  const busted =
    remaining < 0 ||
    remaining === 1 ||
    (remaining === 0 && state.settings.doubleOut && !isDoubleThrow(thrownDart));

  if (busted) {
    return endTurn(state, player, turnThrows, scoreBeforeTurn, "Bust!");
  }

  const players = [...state.players];
  players[state.currentPlayerIndex] = { ...player, score: remaining };

  if (remaining === 0) {
    return {
      ...state,
      players,
      currentTurnThrows: turnThrows,
      winnerIndex: state.currentPlayerIndex,
      message: `${player.name} wins!`,
    };
  }

  if (isLastDartOfTurn) {
    return endTurn({ ...state, players }, players[state.currentPlayerIndex], turnThrows, remaining, null);
  }

  return { ...state, players, currentTurnThrows: turnThrows, message: null };
}

function endTurn(
  state: GameState,
  player: PlayerState,
  turnThrows: Throw[],
  finalScore: number,
  message: string | null
): GameState {
  const players = [...state.players];
  const idx = state.currentPlayerIndex;
  players[idx] = { ...players[idx], score: finalScore, turns: [...player.turns, turnThrows] };

  const nextPlayerIndex = (idx + 1) % players.length;

  return {
    ...state,
    players,
    currentPlayerIndex: nextPlayerIndex,
    currentTurnThrows: [],
    message,
  };
}

/** Undo the last dart thrown in the current (unfinished) turn. */
export function undoLastThrow(state: GameState): GameState {
  if (state.currentTurnThrows.length === 0 || state.winnerIndex !== null) return state;
  return {
    ...state,
    currentTurnThrows: state.currentTurnThrows.slice(0, -1),
    message: null,
  };
}
