# Winter Tebolympics Frontend

React + TypeScript frontend for the Winter Tebolympics real-time tracking application.

## Architecture

```
src/
├── main.tsx                # Application entry point
├── App.tsx                 # Root component
├── components/
│   ├── Header.tsx          # Banner component
│   ├── UpdateInfo.tsx      # Last update and countdown display
│   ├── Scoreboard.tsx      # Animated team list
│   ├── TeamCard.tsx        # Individual team display
│   └── CountryMedals.tsx   # Country medal breakdown
├── hooks/
│   └── useSocket.ts        # WebSocket connection hook
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   └── format.ts           # Formatting utilities
└── styles/
    └── global.css          # Global styles and CSS variables
```

## Component Hierarchy

```
App
├── Header
├── UpdateInfo
└── Scoreboard
    └── TeamCard (×12)
        └── CountryMedals (×3)
```

## Components

### App
Root component that manages WebSocket connection state and renders layout.

**States:**
- Loading: Shows spinner while connecting
- Error: Displays error message if connection fails
- Connected: Renders full application

### Header
Static banner displaying application title with gradient styling.

### UpdateInfo
Displays last update time and countdown to next update.

**Props:**
- `lastUpdate: string` - ISO timestamp
- `nextUpdate: string` - ISO timestamp

**Features:**
- Real-time countdown (updates every second)
- Formatted timestamps

### Scoreboard
Container for team cards with animated reordering.

**Props:**
- `teams: TeamScore[]` - Ranked array of teams

**Features:**
- Framer Motion layout animations
- Smooth transitions on rank changes
- Proper keying for performance

### TeamCard
Displays individual team information and medal breakdowns.

**Props:**
- `teamScore: TeamScore` - Team data with rank and scores

**Features:**
- Rank-based styling (gold/silver/bronze borders for top 3)
- Rank emoji indicators
- Hover effects

### CountryMedals
Displays single country's medal count and points.

**Props:**
- `data: TeamCountryMedals` - Country medal data

**Features:**
- Country flag emoji
- Medal type indicator
- Color-coded borders

## Hooks

### useSocket

Custom hook for WebSocket connection management.

**Returns:**
```typescript
{
  scoreboardData: ScoreboardData | null,
  connected: boolean,
  error: string | null
}
```

**Features:**
- Auto-connect on mount
- Auto-reconnect on disconnect
- Error handling
- Cleanup on unmount

## Utilities

### format.ts

**Functions:**
- `formatTimestamp(iso: string): string` - "12:34:56 PM"
- `formatCountdown(seconds: number): string` - "04:32"
- `formatPoints(points: number): string` - "42"

## Styling

### Design System

CSS variables (in `global.css`):
```css
--color-gold: #ffd700
--color-silver: #c0c0c0
--color-bronze: #cd7f32
--color-background: #0a0e27
--color-card: #1a1f3a
--color-text: #ffffff
--color-text-secondary: #a0a0a0
--color-border: #2a2f4a
```

### Responsive Breakpoints

- Desktop: > 768px
- Mobile: ≤ 768px

All components include mobile-optimized styles.

## Animations

Powered by Framer Motion:

- **Layout animations**: Smooth reordering when ranks change
- **Entry animations**: Fade + slide up on mount
- **Exit animations**: Fade + slide down on unmount
- **Hover effects**: Transform and shadow transitions

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## Configuration

Environment variables (`.env`):
```env
VITE_API_URL=http://localhost:3001
```

## State Management

No external state management library needed. State is managed via:
- `useSocket` hook for WebSocket data
- `useState` for local component state
- `useEffect` for side effects (countdown timer)

## Performance Optimizations

- Proper React keys (`team.id`) for list rendering
- Framer Motion layout animations (GPU accelerated)
- Minimal re-renders (state updates only on data change)
- CSS transitions for hover effects

## Error Handling

- Connection errors display user-friendly message
- Disconnection shows loading state
- Auto-reconnection on network recovery

## Testing Checklist

- [ ] Application loads without console errors
- [ ] Connects to backend WebSocket
- [ ] Displays all 12 teams
- [ ] Countdown timer updates every second
- [ ] Rank changes animate smoothly
- [ ] Hover effects work on cards and country sections
- [ ] Responsive design works on mobile
- [ ] Connection error displays when backend is down
- [ ] Reconnects when backend restarts
- [ ] Multiple tabs all receive updates

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Modern browsers with ES2020 and CSS Grid support.
