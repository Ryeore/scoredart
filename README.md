# ScoreDart

A minimalistic web app for tracking scores in a game of darts, built with Next.js. Designed to be hosted on Vercel.

## Features

- **Main menu** to start a new match.
- **Setup screen** — choose 1-4 players (with custom names), game type (301 / 501 / 701), and whether a leg must finish on a double.
- **Two scoring inputs**:
  - **Dart Board** — an interactive SVG board with accurate segments and rings. Tap a segment to score, or press and hold to open a magnified loupe that follows your finger/cursor for precise placement.
  - **Quick Entry** — a grid of numbers 1-20 with Single / Double / Triple multiplier toggle, plus dedicated 25, Bull (50), and Miss buttons.
- **Live scoreboard** with turn tracking, bust detection, and a winner screen with rematch / main menu options.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Project Structure

- `src/app` — routes: main menu (`/`), game setup (`/setup`), and the match screen (`/game`).
- `src/components` — `DartBoard`, `BoardArt`, `QuickEntry`, `Scoreboard`, `WinnerModal`.
- `src/context/GameContext.tsx` — shared game state across the setup and game screens.
- `src/lib` — `dartboardMath.ts` (segment/ring geometry), `gameLogic.ts` (turn, bust, and win rules), `types.ts`.

## Deploy on Vercel

Import this repository into [Vercel](https://vercel.com/new) — it will be auto-detected as a Next.js project and requires no additional configuration.
