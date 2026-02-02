# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Winter Tebolympics 2026 is a real-time fantasy Olympics tracking application. Twelve managers compete by selecting three countries each (gold, silver, bronze). Points are earned based on medal performance: gold country golds × 3, silver country silvers × 2, bronze country bronzes × 1.

## Architecture

### Unified Monorepo Structure

This project uses a **single root package.json** with ES modules throughout. Both backend and frontend are built and deployed as a unified service where the backend serves the frontend static files in production.

```
root/
├── package.json          # Single source for all dependencies
├── backend/
│   ├── src/
│   │   ├── index.ts      # Express + Socket.io server (ES modules with .js extensions)
│   │   ├── services/     # Scoring, medal data, storage
│   │   ├── socket/       # WebSocket event handlers
│   │   └── data/         # teams.json (static), medal-data.json (runtime)
│   └── tsconfig.json     # module: ESNext
└── frontend/
    ├── src/
    │   ├── App.tsx       # Root component
    │   ├── hooks/        # useSocket for WebSocket connection
    │   └── components/   # Header, Scoreboard, TeamCard, CountryMedals, UpdateInfo
    └── tsconfig.json
```

### Key Architectural Decisions

1. **ES Modules**: The entire project uses ES modules (`"type": "module"` in root package.json). Backend TypeScript compiles to ESNext and requires `.js` extensions on all imports.

2. **Smart API Detection**: The frontend (`useSocket.ts`) automatically detects the environment:
   - Development (localhost:5173): Connects to localhost:3001
   - Production: Uses `window.location.origin` (same-origin, no CORS issues)

3. **Unified Deployment**: Backend serves frontend static files in production. Single build command, single start command.

4. **Real-time Architecture**: Socket.io broadcasts `scoreUpdate` events every 5 minutes to all connected clients. Updates include full scoreboard data with rankings.

## Common Commands

### Development
```bash
# Install all dependencies (both backend and frontend)
npm install

# Development mode (run in separate terminals)
npm run dev:backend     # Backend on localhost:3001
npm run dev:frontend    # Frontend on localhost:5173

# Type checking (both projects)
npm run type-check
```

### Building
```bash
# Build both backend and frontend
npm run build

# Build individually
npm run build:backend   # TypeScript → backend/dist/
npm run build:frontend  # React → frontend/dist/
```

### Production
```bash
# Start production server (serves both API and frontend)
NODE_ENV=production npm start

# Access at http://localhost:3001
```

### Deployment (Render)
```bash
# Deploy commands (configured in render.yaml)
Build: npm run build
Start: npm start
```

## Scoring Logic

The scoring service (`backend/src/services/scoring-service.ts`) implements cascading tiebreakers:

1. **Total points** (descending) - Primary ranking
2. **Gold medals from gold country** (descending) - First tiebreaker
3. **Silver medals from silver country** (descending) - Second tiebreaker
4. **Bronze medals from bronze country** (descending) - Third tiebreaker
5. **Tiebreaker rank** (ascending) - Final tiebreaker from previous competition

Critical: Each team only earns points from their designated medal type per country. Gold country only earns from gold medals, not silver or bronze.

## Data Flow

1. **Initialization**: Server starts → loads teams from `teams.json` → generates/loads medal data → calculates scores → ranks teams
2. **Updates**: Every 5 minutes → generate new mock data → save to `medal-data.json` → recalculate scores → broadcast via Socket.io
3. **Client Connection**: New client connects → immediately receives current scoreboard → subscribes to `scoreUpdate` events

## Critical Implementation Details

### Backend ES Module Imports

All imports in backend must include `.js` extensions (even when importing `.ts` files):
```typescript
import { config } from './config/config.js';  // NOT './config/config'
import teamsData from './data/teams.json' with { type: 'json' };
```

### __dirname in ES Modules

Backend files using `__dirname` must include the polyfill:
```typescript
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### Socket.io Connection Logic

Frontend hook automatically handles environment detection - no manual configuration needed. In production, always uses same-origin connection.

### Framer Motion Layout Animations

Scoreboard uses `layout` prop for automatic position transitions:
```tsx
<motion.div key={teamScore.team.id} layout transition={{ duration: 0.5 }}>
  <TeamCard teamScore={teamScore} />
</motion.div>
```

Key must be `team.id` for proper animation tracking.

## Configuration

### Environment Variables

Backend only (no frontend .env needed):
```
NODE_ENV=production          # Enables static file serving
PORT=3001                    # Server port
USE_MOCK_DATA=true          # Generate random medal data
CORS_ORIGIN=*               # Allowed origins (irrelevant in production)
```

### Team Data Structure

Teams defined in `backend/src/data/teams.json` with ISO country codes:
- 12 teams with managers: Nick A., Scott, Steve, Kerry, Adam, Nick W., Zach, Gabe, Lexi, Phil, Chris, Eric
- Each has goldCountry, silverCountry, bronzeCountry with `code` and `name`
- tiebreakerRank (1-12) for final tiebreaking

## API Endpoints

- `GET /api/health` - Health check (used by Render)
- `GET /api/scoreboard` - Current scoreboard data (REST fallback)
- `POST /api/refresh` - Manually trigger update (testing)
- `GET /` - Frontend static files (production only)

## Debugging

### Common Issues

1. **"exports is not defined"**: Backend TypeScript compiling to CommonJS instead of ESNext. Check `backend/tsconfig.json` has `"module": "ESNext"`.

2. **"Cannot find module" without .js**: Backend imports must include `.js` extension for ES modules.

3. **Frontend connects to localhost on Render**: `useSocket.ts` should use `window.location.origin` detection logic, not hardcoded URL.

4. **Animations not working**: Ensure Framer Motion `motion.div` has both `key` (team.id) and `layout` prop.

### Testing Locally

1. Start both dev servers
2. Open http://localhost:5173
3. Verify WebSocket connection in browser console
4. Wait 5 minutes or trigger manual refresh: `curl -X POST http://localhost:3001/api/refresh`
5. Observe rank animations

## Deployment Notes

Deploys to Render as single unified web service:
- Root directory (no subdirectory)
- Builds both backend and frontend
- Backend serves frontend from `backend/dist/index.js`
- Static files from `frontend/dist/` served via Express middleware in production
- Free tier spins down after 15 minutes of inactivity (cold start: 30-60 seconds)
