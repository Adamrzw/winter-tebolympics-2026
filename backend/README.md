# Winter Tebolympics Backend

Node.js backend server providing REST API and WebSocket communication for the Winter Tebolympics application.

## Architecture

```
src/
├── index.ts              # Express server and Socket.io setup
├── config/
│   └── config.ts         # Environment configuration
├── data/
│   ├── teams.json        # Team and country assignments
│   └── medal-data.json   # Generated medal counts (runtime)
├── services/
│   ├── medal-service.ts  # Mock data generation
│   ├── scoring-service.ts # Score calculation and ranking
│   └── storage-service.ts # File I/O operations
├── socket/
│   └── socket-handler.ts # WebSocket event handling
└── types/
    └── index.ts          # TypeScript type definitions
```

## API Documentation

### REST Endpoints

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-02T12:00:00.000Z"
}
```

#### GET /api/scoreboard
Get current scoreboard data.

**Response:**
```json
{
  "teams": [
    {
      "team": {
        "id": "nick-a",
        "managerName": "Nick A.",
        "goldCountry": { "code": "NOR", "name": "Norway" },
        "silverCountry": { "code": "AUT", "name": "Austria" },
        "bronzeCountry": { "code": "KOR", "name": "South Korea" },
        "tiebreakerRank": 1
      },
      "totalPoints": 42,
      "goldCountryMedals": {
        "country": { "code": "NOR", "name": "Norway" },
        "medalType": "gold",
        "count": 12,
        "points": 36
      },
      "silverCountryMedals": { ... },
      "bronzeCountryMedals": { ... },
      "rank": 1
    }
  ],
  "lastUpdate": "2026-02-02T12:00:00.000Z",
  "nextUpdate": "2026-02-02T12:05:00.000Z"
}
```

#### POST /api/refresh
Manually trigger data refresh and broadcast to all connected clients.

**Response:**
```json
{
  "success": true,
  "data": { /* ScoreboardData */ }
}
```

### WebSocket Events

#### Client → Server

- `connection` - Establish WebSocket connection
- `requestUpdate` - Request current scoreboard data (throttled to 1 req/sec)
- `disconnect` - Close connection

#### Server → Client

- `scoreUpdate` - Broadcast when data updates
  ```typescript
  {
    teams: TeamScore[],
    lastUpdate: string,
    nextUpdate: string
  }
  ```

## Services

### Medal Service
Generates mock medal data for testing. Each country receives 0-20 medals of each type (gold, silver, bronze).

### Scoring Service
Calculates team scores and applies ranking logic:
1. Calculate points: gold country golds × 3 + silver country silvers × 2 + bronze country bronzes × 1
2. Rank teams by total points (desc), then by tiebreaker rules

### Storage Service
Handles persistent storage of medal data:
- `loadMedalData()` - Read from `medal-data.json`
- `saveMedalData()` - Atomic write with temp file

## Configuration

Environment variables (`.env`):

```env
PORT=3001                          # Server port
CORS_ORIGIN=http://localhost:5173  # Allowed frontend origin
USE_MOCK_DATA=true                 # Generate mock data vs load from file
```

## Development

```bash
# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run type-check
```

## Data Flow

1. Server starts → Generate/load medal data
2. Calculate scores for all teams
3. Rank teams with tiebreaker logic
4. Store in memory and broadcast to clients
5. Every 5 minutes, repeat steps 1-4
6. On client connect, send current data immediately

## Error Handling

- File I/O errors are logged and re-throw
- Missing medal data file results in mock data generation
- Socket errors are logged but don't crash server
- Request throttling prevents spam

## Testing

Manual testing checklist:
- [ ] Server starts without errors
- [ ] `/api/health` returns 200
- [ ] `/api/scoreboard` returns valid data
- [ ] WebSocket connections establish
- [ ] Clients receive `scoreUpdate` on connect
- [ ] Data refreshes every 5 minutes
- [ ] Manual refresh via `/api/refresh` works
- [ ] Multiple clients all receive updates

## Performance

- Update interval: 5 minutes (configurable)
- Request throttling: 1 req/sec per client
- Atomic file writes prevent corruption
- In-memory caching of current scoreboard
