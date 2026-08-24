"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { GameSettings, GameState, Throw } from "@/lib/types";
import { createInitialGameState, registerThrow, undoLastThrow, confirmTurn, editThrowAt } from "@/lib/gameLogic";

interface GameContextValue {
  gameState: GameState | null;
  startGame: (settings: GameSettings) => void;
  throwDart: (t: Throw) => void;
  undoThrow: () => void;
  confirmCurrentTurn: () => void;
  editThrow: (index: number, t: Throw) => void;
  endGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const value = useMemo<GameContextValue>(
    () => ({
      gameState,
      startGame: (settings) => setGameState(createInitialGameState(settings)),
      throwDart: (t) => setGameState((prev) => (prev ? registerThrow(prev, t) : prev)),
      undoThrow: () => setGameState((prev) => (prev ? undoLastThrow(prev) : prev)),
      confirmCurrentTurn: () => setGameState((prev) => (prev ? confirmTurn(prev) : prev)),
      editThrow: (index, t) => setGameState((prev) => (prev ? editThrowAt(prev, index, t) : prev)),
      endGame: () => setGameState(null),
    }),
    [gameState]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
