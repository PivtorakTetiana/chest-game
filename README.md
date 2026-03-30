## Overview

Chest Game is an interactive game where players select chests to reveal random outcomes. Each chest can result in a loss, a regular win, or a bonus win that triggers a special animation screen.

## Tech Stack

- **Rendering Engine**: PIXI.js v8.x (WebGL/Canvas)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Testing**: Vitest with coverage reporting (88% coverage)
- **Code Quality**: ESLint 9 + Prettier
- **Dependencies**: Minimal (only PIXI.js core)

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The game will be available at `http://localhost:5173` (or next available port).

## Production Build

Create an optimized production build:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Testing

Run the full test suite:

```bash
npm test
```

Run tests with interactive UI:

```bash
npm run test:ui
```

Generate code coverage report:

```bash
npm run test:coverage
```

Run TypeScript type checking:

```bash
npm run type-check
```

Lint the codebase:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

Format code with Prettier:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run all quality checks:

```bash
npm run type-check && npm run lint && npm run format:check && npm test -- --run
```

## Game Rules

### Initial State
- PLAY button is enabled
- All 6 chests are disabled and closed

### Gameplay Flow

1. **Click PLAY Button**
   - PLAY button becomes disabled
   - All chests become clickable with spawn animation

2. **Click a Chest**
   - All game elements become disabled
   - Game randomly determines the outcome:
     - 70% chance: Lose
     - 30% chance: Win
       - 67% of wins: Regular win ($100-$500)
       - 33% of wins: Bonus win ($1000-$5000)
   - Chest opens with corresponding animation:
     - **Lose**: Gray color, shake animation
     - **Regular Win**: Green glow, displays win amount
     - **Bonus Win**: Gold glow, pulse animation

3. **After Chest Animation**
   - **Regular Win or Lose**: Chest remains open, other unopened chests become clickable
   - **Bonus Win**: Player is redirected to Bonus Screen
     - Animated text and win amount display
     - Automatic return to main screen after animation completes

4. **All Chests Opened**
   - PLAY button becomes enabled
   - Click PLAY to reset game (all chests close and become active)