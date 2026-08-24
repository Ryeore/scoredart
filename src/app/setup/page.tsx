"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGame } from "@/context/GameContext";
import type { GameType } from "@/lib/types";

const GAME_TYPES: GameType[] = [301, 501, 701];
const PLAYER_COUNTS = [1, 2, 3, 4];

export default function SetupPage() {
  const router = useRouter();
  const { startGame } = useGame();

  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [gameType, setGameType] = useState<GameType>(501);
  const [doubleOut, setDoubleOut] = useState(true);

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function handleStart() {
    const playerNames = names
      .slice(0, playerCount)
      .map((n, i) => n.trim() || `Player ${i + 1}`);

    startGame({ gameType, doubleOut, playerNames });
    router.push("/game");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 p-6">
      <h1 className="text-2xl font-bold">New Game</h1>

      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-400">Players</h2>
        <div className="mb-4 grid grid-cols-4 gap-2">
          {PLAYER_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setPlayerCount(count)}
              className={`rounded-lg py-2 text-lg font-semibold transition ${
                playerCount === count
                  ? "bg-accent text-white"
                  : "bg-neutral-800 text-neutral-300"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: playerCount }).map((_, i) => (
            <input
              key={i}
              value={names[i]}
              onChange={(e) => updateName(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              maxLength={16}
              className="rounded-lg bg-neutral-800 px-4 py-2 text-base outline-none focus:ring-2 focus:ring-accent"
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-400">Game type</h2>
        <div className="grid grid-cols-3 gap-2">
          {GAME_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setGameType(type)}
              className={`rounded-lg py-3 text-lg font-semibold transition ${
                gameType === type ? "bg-accent text-white" : "bg-neutral-800 text-neutral-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section>
        <button
          onClick={() => setDoubleOut((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg bg-neutral-800 px-4 py-3"
        >
          <span className="text-sm font-medium text-neutral-200">Finish on a double</span>
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              doubleOut ? "bg-accent" : "bg-neutral-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                doubleOut ? "left-5" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </section>

      <button
        onClick={handleStart}
        className="mt-auto rounded-full bg-accent py-4 text-lg font-semibold text-white shadow-lg shadow-accent/30 transition active:scale-95"
      >
        Start Match
      </button>
    </main>
  );
}
