# Winter Tebolympics 2026 - Detailed Requirements

## Project Overview

A real-time fantasy Olympics tracking web application that displays live scores for 12 fantasy teams. Each team has drafted three countries (gold, silver, bronze) and earns points based on the medal performance of their drafted countries during the 2026 Winter Olympics.

## Technology Stack

### Front-end
- **Framework**: React 18+
- **Language**: TypeScript (TSX for React components)
- **Build Tool**: Vite
- **Real-time Communication**: Socket.io-client
- **Styling**: CSS Modules or styled-components (choose based on preference)
- **Animation**: Framer Motion or React Spring for smooth transitions

### Back-end
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript (compiled to JavaScript)
- **Real-time Communication**: Socket.io
- **Data Storage**: File-based JSON storage
- **HTTP Client**: Axios or node-fetch for API calls

### Shared
- **Package Manager**: npm
- **Type Definitions**: Shared TypeScript interfaces between front-end and back-end
- **Version Control**: Git repository

## Game Rules & Scoring Logic

### Team Structure
- 12 teams total
- Each team has:
  - Manager name
  - One gold medal country
  - One silver medal country
  - One bronze medal country
  - Tiebreaker rank (1-12, from previous competition)

### Drafting Rules
- A country can be drafted by multiple teams, but only in different medal slots
- A single team cannot have the same country in multiple medal slots
- Example: South Korea can be Team A's gold and Team B's bronze, but not Team A's gold and silver

### Scoring System
- **Multiplicative scoring**: Each individual medal counts separately
- Gold country medals: 3 points per gold medal
- Silver country medals: 2 points per silver medal
- Bronze country medals: 1 point per bronze medal
- Example: If South Korea (gold country) wins 5 gold medals, the team earns 5 × 3 = 15 points

### Ranking & Tiebreakers
1. Teams ranked 1st (highest points) to 12th (lowest points)
2. Tiebreaker order (if teams have equal points):
   - Total number of gold medals earned by gold country
   - Total number of silver medals earned by silver country
   - Total number of bronze medals earned by bronze country
   - Tiebreaker rank (place from previous competition, stored in team data)

## Data Models

### TypeScript Interfaces

```typescript
// Shared types (should be in a shared package or duplicated with same definitions)

export interface Country {
  name: string;           // Display name
  isoCode: string;        // ISO 3166-1 alpha-3 code (e.g., "KOR", "GBR")
  flagEmoji: string;      // Unicode flag emoji
}

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export interface TeamCountryMedals {
  country: Country;
  medals: MedalCount;
  points: number;         // Calculated based on medal type and count
}

export interface Team {
  id: string;             // Unique identifier
  manager: string;
  tiebreakerRank: number; // 1-12, from previous competition
  goldCountry: Country;
  silverCountry: Country;
  bronzeCountry: Country;
}

export interface TeamScore {
  team: Team;
  totalPoints: number;
  currentRank: number;    // 1-12, calculated from current scores
  goldMedals: TeamCountryMedals;
  silverMedals: TeamCountryMedals;
  bronzeMedals: TeamCountryMedals;
}

export interface MedalTableEntry {
  country: Country;
  medals: MedalCount;
}

export interface ScoreboardData {
  rankings: TeamScore[];  // Sorted by rank (1st to 12th)
  lastUpdated: string;    // ISO 8601 timestamp
  nextUpdate: string;     // ISO 8601 timestamp
}

export interface SocketEvents {
  // Server → Client
  scoreUpdate: ScoreboardData;
  connectionStatus: { connected: boolean; message?: string };

  // Client → Server
  requestUpdate: void;
}
```

### Team Data (Static Configuration)

Store in `backend/src/data/teams.json`:

```json
[
  {
    "id": "team-01",
    "manager": "Nick A.",
    "tiebreakerRank": 1,
    "goldCountry": { "name": "South Korea", "isoCode": "KOR", "flagEmoji": "🇰🇷" },
    "silverCountry": { "name": "Latvia", "isoCode": "LVA", "flagEmoji": "🇱🇻" },
    "bronzeCountry": { "name": "Great Britain", "isoCode": "GBR", "flagEmoji": "🇬🇧" }
  },
  {
    "id": "team-02",
    "manager": "Scott",
    "tiebreakerRank": 2,
    "goldCountry": { "name": "Great Britain", "isoCode": "GBR", "flagEmoji": "🇬🇧" },
    "silverCountry": { "name": "Spain", "isoCode": "ESP", "flagEmoji": "🇪🇸" },
    "bronzeCountry": { "name": "South Korea", "isoCode": "KOR", "flagEmoji": "🇰🇷" }
  },
  {
    "id": "team-03",
    "manager": "Steve",
    "tiebreakerRank": 3,
    "goldCountry": { "name": "Finland", "isoCode": "FIN", "flagEmoji": "🇫🇮" },
    "silverCountry": { "name": "Hungary", "isoCode": "HUN", "flagEmoji": "🇭🇺" },
    "bronzeCountry": { "name": "Latvia", "isoCode": "LVA", "flagEmoji": "🇱🇻" }
  },
  {
    "id": "team-04",
    "manager": "Kerry",
    "tiebreakerRank": 4,
    "goldCountry": { "name": "Slovenia", "isoCode": "SVN", "flagEmoji": "🇸🇮" },
    "silverCountry": { "name": "Poland", "isoCode": "POL", "flagEmoji": "🇵🇱" },
    "bronzeCountry": { "name": "Finland", "isoCode": "FIN", "flagEmoji": "🇫🇮" }
  },
  {
    "id": "team-05",
    "manager": "Adam",
    "tiebreakerRank": 5,
    "goldCountry": { "name": "New Zealand", "isoCode": "NZL", "flagEmoji": "🇳🇿" },
    "silverCountry": { "name": "Belgium", "isoCode": "BEL", "flagEmoji": "🇧🇪" },
    "bronzeCountry": { "name": "Slovenia", "isoCode": "SVN", "flagEmoji": "🇸🇮" }
  },
  {
    "id": "team-06",
    "manager": "Nick W.",
    "tiebreakerRank": 6,
    "goldCountry": { "name": "Australia", "isoCode": "AUS", "flagEmoji": "🇦🇺" },
    "silverCountry": { "name": "Czech Republic", "isoCode": "CZE", "flagEmoji": "🇨🇿" },
    "bronzeCountry": { "name": "New Zealand", "isoCode": "NZL", "flagEmoji": "🇳🇿" }
  },
  {
    "id": "team-07",
    "manager": "Zach",
    "tiebreakerRank": 7,
    "goldCountry": { "name": "Hungary", "isoCode": "HUN", "flagEmoji": "🇭🇺" },
    "silverCountry": { "name": "Great Britain", "isoCode": "GBR", "flagEmoji": "🇬🇧" },
    "bronzeCountry": { "name": "Australia", "isoCode": "AUS", "flagEmoji": "🇦🇺" }
  },
  {
    "id": "team-08",
    "manager": "Gabe",
    "tiebreakerRank": 8,
    "goldCountry": { "name": "Belgium", "isoCode": "BEL", "flagEmoji": "🇧🇪" },
    "silverCountry": { "name": "Slovenia", "isoCode": "SVN", "flagEmoji": "🇸🇮" },
    "bronzeCountry": { "name": "Hungary", "isoCode": "HUN", "flagEmoji": "🇭🇺" }
  },
  {
    "id": "team-09",
    "manager": "Lexi",
    "tiebreakerRank": 9,
    "goldCountry": { "name": "Czech Republic", "isoCode": "CZE", "flagEmoji": "🇨🇿" },
    "silverCountry": { "name": "Australia", "isoCode": "AUS", "flagEmoji": "🇦🇺" },
    "bronzeCountry": { "name": "Belgium", "isoCode": "BEL", "flagEmoji": "🇧🇪" }
  },
  {
    "id": "team-10",
    "manager": "Phil",
    "tiebreakerRank": 10,
    "goldCountry": { "name": "Slovakia", "isoCode": "SVK", "flagEmoji": "🇸🇰" },
    "silverCountry": { "name": "New Zealand", "isoCode": "NZL", "flagEmoji": "🇳🇿" },
    "bronzeCountry": { "name": "Poland", "isoCode": "POL", "flagEmoji": "🇵🇱" }
  },
  {
    "id": "team-11",
    "manager": "Chris",
    "tiebreakerRank": 11,
    "goldCountry": { "name": "Poland", "isoCode": "POL", "flagEmoji": "🇵🇱" },
    "silverCountry": { "name": "Finland", "isoCode": "FIN", "flagEmoji": "🇫🇮" },
    "bronzeCountry": { "name": "Czech Republic", "isoCode": "CZE", "flagEmoji": "🇨🇿" }
  },
  {
    "id": "team-12",
    "manager": "Eric",
    "tiebreakerRank": 12,
    "goldCountry": { "name": "Spain", "isoCode": "ESP", "flagEmoji": "🇪🇸" },
    "silverCountry": { "name": "South Korea", "isoCode": "KOR", "flagEmoji": "🇰🇷" },
    "bronzeCountry": { "name": "Slovakia", "isoCode": "SVK", "flagEmoji": "🇸🇰" }
  }
]
```

## Back-end Requirements

### Project Structure
```
backend/
├── src/
│   ├── index.ts                 # Express server entry point
│   ├── config/
│   │   └── config.ts            # Configuration (ports, intervals, etc.)
│   ├── data/
│   │   ├── teams.json           # Static team data
│   │   └── medal-data.json      # Persisted medal data (file storage)
│   ├── services/
│   │   ├── medal-service.ts     # Fetch/mock medal data
│   │   ├── scoring-service.ts   # Calculate scores and rankings
│   │   └── storage-service.ts   # Read/write medal data to file
│   ├── socket/
│   │   └── socket-handler.ts    # Socket.io connection handling
│   └── types/
│       └── index.ts             # Shared TypeScript interfaces
├── package.json
└── tsconfig.json
```

### Core Functionality

#### Medal Data Service
- **Mock Data**: Generate mock medal counts for testing
  - Each country should have randomized medal counts (0-20 per medal type)
  - Provide a seed option for deterministic testing
  - Store mock data structure that can be easily replaced with real API integration

- **Update Interval**:
  - Fetch/generate new medal data every 5 minutes (300,000ms)
  - First fetch happens immediately on server startup
  - Use `setInterval` for periodic updates

- **Data Mapping**:
  - Create a mapping layer to convert external API format to internal `MedalTableEntry[]`
  - Use ISO country codes for matching
  - Log warnings for unrecognized countries

#### Scoring Service
- Calculate scores for all 12 teams based on current medal data
- For each team:
  1. Look up medal counts for gold country (by ISO code)
  2. Calculate gold points = goldMedals.gold × 3
  3. Look up medal counts for silver country
  4. Calculate silver points = silverMedals.silver × 2
  5. Look up medal counts for bronze country
  6. Calculate bronze points = bronzeMedals.bronze × 1
  7. Total points = gold points + silver points + bronze points

- Rank all teams 1-12 using tiebreaker logic:
  ```typescript
  function rankTeams(scores: TeamScore[]): TeamScore[] {
    return scores.sort((a, b) => {
      // Primary: Total points (descending)
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      // Tiebreaker 1: Gold medals from gold country
      if (a.goldMedals.medals.gold !== b.goldMedals.medals.gold) {
        return b.goldMedals.medals.gold - a.goldMedals.medals.gold;
      }

      // Tiebreaker 2: Silver medals from silver country
      if (a.silverMedals.medals.silver !== b.silverMedals.medals.silver) {
        return b.silverMedals.medals.silver - a.silverMedals.medals.silver;
      }

      // Tiebreaker 3: Bronze medals from bronze country
      if (a.bronzeMedals.medals.bronze !== b.bronzeMedals.medals.bronze) {
        return b.bronzeMedals.medals.bronze - a.bronzeMedals.medals.bronze;
      }

      // Final tiebreaker: Previous competition rank (ascending)
      return a.team.tiebreakerRank - b.team.tiebreakerRank;
    }).map((score, index) => ({
      ...score,
      currentRank: index + 1
    }));
  }
  ```

#### Storage Service
- **File Path**: `backend/src/data/medal-data.json`
- **Save Operations**:
  - Save medal data after each update
  - Use atomic writes (write to temp file, then rename)
  - Include timestamp of last update

- **Load Operations**:
  - Load persisted data on server startup
  - If file doesn't exist or is corrupted, start with empty data
  - Validate loaded data against TypeScript interfaces

#### Socket.io Handler
- **Connection**: Accept client connections on `/socket.io`
- **Events**:
  - `connection`: Send current scoreboard data immediately to new clients
  - `scoreUpdate`: Emit to all connected clients when data updates
  - `requestUpdate`: Allow clients to request manual refresh (throttle to prevent abuse)
  - `disconnect`: Clean up client connection

- **Broadcasting**: When medal data updates:
  1. Calculate new scores
  2. Save to file
  3. Emit `scoreUpdate` event with full `ScoreboardData` to all clients

#### Express API (REST fallback)
- `GET /api/scoreboard`: Return current scoreboard data (for debugging or non-socket clients)
- `GET /api/health`: Health check endpoint
- `POST /api/refresh`: Trigger manual medal data refresh (for testing)

### Configuration
Store in `backend/src/config/config.ts`:
```typescript
export const config = {
  port: process.env.PORT || 3001,
  updateInterval: 5 * 60 * 1000, // 5 minutes in milliseconds
  dataFilePath: './src/data/medal-data.json',
  teamsFilePath: './src/data/teams.json',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  useMockData: process.env.USE_MOCK_DATA !== 'false', // true by default
};
```

### npm Scripts
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit"
  }
}
```

## Front-end Requirements

### Project Structure
```
frontend/
├── src/
│   ├── main.tsx                 # Vite entry point
│   ├── App.tsx                  # Root component
│   ├── components/
│   │   ├── Header.tsx           # "2026 Winter Tebolympics" banner
│   │   ├── Scoreboard.tsx       # Main scoreboard container
│   │   ├── TeamCard.tsx         # Individual team display card
│   │   ├── CountryMedals.tsx    # Country flag, name, medals, points
│   │   └── UpdateInfo.tsx       # Last update time & countdown
│   ├── hooks/
│   │   └── useSocket.ts         # Socket.io connection & state management
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces (duplicate from backend)
│   ├── utils/
│   │   ├── format.ts            # Date/number formatting utilities
│   │   └── animation.ts         # Animation configurations
│   └── styles/
│       ├── global.css           # Global styles & CSS variables
│       └── [component].module.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### UI Components

#### Header Component
- Full-width banner at top of page
- Text: "2026 Winter Tebolympics"
- Styling: Bold, large font, centered, with accent color
- Fixed/sticky positioning optional (user preference)

#### UpdateInfo Component
- Display last update timestamp: "Last updated: Feb 2, 2026 at 10:30 AM"
- Display countdown to next update: "Next update in: 4:23"
- Format countdown as MM:SS
- Update countdown every second
- Position: Below header, above scoreboard

#### Scoreboard Component
- Container for vertical list of TeamCard components
- Displays cards in rank order (1st at top)
- Implements animation when order changes:
  - Use Framer Motion's `AnimatePresence` and `motion.div`
  - Animate `layout` property for smooth position transitions
  - Duration: 0.5-0.8 seconds with easing
  - Cards should smoothly move to new positions when rankings change

#### TeamCard Component
Display format (card layout):
```
┌─────────────────────────────────────────────┐
│  #1 - Nick A.                    75 points  │
│─────────────────────────────────────────────│
│  🇰🇷 South Korea (Gold)                     │
│     5 Gold Medals → 15 points               │
│                                             │
│  🇱🇻 Latvia (Silver)                        │
│     8 Silver Medals → 16 points             │
│                                             │
│  🇬🇧 Great Britain (Bronze)                 │
│     44 Bronze Medals → 44 points            │
└─────────────────────────────────────────────┘
```

Card Structure:
- **Header Section**:
  - Current rank (large, prominent): "#1"
  - Manager name: "Nick A."
  - Total points (right-aligned): "75 points"

- **Country Sections** (3 sections: gold, silver, bronze):
  - Flag emoji (large): "🇰🇷"
  - Country name: "South Korea"
  - Medal type indicator: "(Gold)" / "(Silver)" / "(Bronze)"
  - Medal count: "5 Gold Medals"
  - Points from this country: "→ 15 points"
  - Visual indicator of medal type (gold color for gold section, etc.)

Styling:
- Each card has border and shadow
- Spacing between cards
- Different accent colors for rank indicators (gold for 1st, silver for 2nd, bronze for 3rd)
- Responsive: Full width on mobile, max-width on desktop

### Real-time Updates

#### Socket.io Integration
Use custom hook `useSocket.ts`:
```typescript
export function useSocket() {
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
    });

    socket.on('scoreUpdate', (data: ScoreboardData) => {
      setScoreboardData(data);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connectionStatus', ({ connected, message }) => {
      if (!connected) {
        setError(message || 'Connection error');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { scoreboardData, connected, error };
}
```

#### Animation on Update
When `scoreboardData` changes:
1. Compare previous rankings with new rankings
2. If ranks change, trigger layout animation
3. Update all displayed values (points, medals)
4. Cards smoothly transition to new positions

### Responsive Design

#### Mobile (< 768px)
- Single column layout
- Full-width cards
- Smaller font sizes
- Stack country info vertically within cards
- Simplified spacing

#### Desktop (≥ 768px)
- Centered layout with max-width (e.g., 1200px)
- Larger cards with more spacing
- Two-column layout for country info within cards (optional)
- Larger fonts and more prominent rank indicators

### npm Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

## Development Workflow

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd winter-tebolympics-2026

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Backend runs on: `http://localhost:3001`
Frontend runs on: `http://localhost:5173`

### Type Checking
Both front-end and back-end should pass TypeScript type checks:
```bash
npm run type-check
```

### Building for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## Testing Requirements

### Manual Testing Scenarios
1. **Initial Load**: Open browser, verify all teams display with mock data
2. **Live Updates**: Wait 5 minutes, verify data updates and animations work
3. **Rank Changes**: Modify mock data to force rank changes, verify smooth transitions
4. **Connection Loss**: Stop backend, verify frontend shows disconnection error
5. **Reconnection**: Restart backend, verify frontend reconnects automatically
6. **Mobile View**: Test on mobile device or browser DevTools mobile emulation
7. **Multiple Clients**: Open multiple browser tabs, verify all receive updates

### Unit Testing (Optional/Future)
- Test scoring calculation logic
- Test tiebreaker logic with edge cases
- Test country code mapping

## Error Handling

### Back-end
- **File I/O errors**: Log error, continue with in-memory data
- **Mock data generation**: Always succeed, use default values if needed
- **Socket errors**: Log error, attempt to reconnect clients

### Front-end
- **Socket connection failure**: Display error message, show retry button
- **Missing data**: Show loading state or placeholder
- **Malformed data**: Log error, display last known good state

## Future Enhancements (Out of Scope for V1)

- Real Olympics API integration
- Historical score tracking and charts
- Admin panel to manually update medal counts
- Push notifications for rank changes
- Export scoreboard as image/PDF
- Dark mode toggle
- Filtering/searching teams
- Detailed team pages with medal breakdown by event

## Environment Variables

### Backend `.env`
```
PORT=3001
CORS_ORIGIN=http://localhost:5173
USE_MOCK_DATA=true
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:3001
```

## Deployment Considerations (Future)

- Backend: Deploy to Heroku, Railway, or similar Node.js hosting
- Frontend: Deploy to Vercel, Netlify, or similar static hosting
- Environment-specific configurations
- HTTPS/WSS for production Socket.io connections
- CORS configuration for production domains
