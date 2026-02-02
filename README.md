# Winter Tebolympics 2026

A real-time fantasy Olympics tracking application for the 2026 Winter Olympics. Track 12 competing managers as they earn points based on their selected countries' medal performances.

## Overview

The Winter Tebolympics is a fantasy sports competition where each manager selects three countries:
- **Gold Country**: Earns 3 points per gold medal
- **Silver Country**: Earns 2 points per silver medal
- **Bronze Country**: Earns 1 point per bronze medal

The application features real-time updates via WebSocket, automatic data refresh every 5 minutes, and smooth animations for rank changes.

## Project Structure

```
winter-tebolympics-2026/
├── backend/          # Node.js + Express + Socket.io server
├── frontend/         # React + TypeScript + Vite client
└── REQUIREMENTS.md   # Original requirements document
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Terminal access

### Installation

Install all dependencies from the root:
```bash
npm install
```

All backend and frontend dependencies are managed in the root `package.json`.

### Running the Application

You can now run everything from the **root directory**:

**Development Mode (two terminals):**

Terminal 1 - Backend:
```bash
npm run dev:backend
```
Server starts on http://localhost:3001

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```
Frontend starts on http://localhost:5173

Then open http://localhost:5173 in your browser.

**Production Mode (single server):**
```bash
npm run build
NODE_ENV=production npm start
```
Open http://localhost:3001 (backend serves frontend)

## Features

- **Real-time Updates**: WebSocket connection provides instant score updates
- **Automatic Refresh**: Medal data refreshes every 5 minutes
- **Smooth Animations**: Framer Motion powers seamless rank transitions
- **Dual View Modes**: Switch between card view and sortable table view
- **Sortable Table**: Click any column header to sort (manager, points, medals, countries)
- **Responsive Design**: Works on desktop and mobile devices
- **Tiebreaker Logic**: Comprehensive ranking system with multiple tiebreaker rules
- **Connection Status**: Visual indicators for server connection state
- **Smart API Detection**: Automatically uses same-origin in production, localhost in development

## Scoring Rules

Teams are ranked by:
1. Total points (descending)
2. Gold medals from gold country (descending)
3. Silver medals from silver country (descending)
4. Bronze medals from bronze country (descending)
5. Previous competition rank (ascending)

## Technology Stack

### Backend
- Node.js + Express
- Socket.io for WebSocket communication
- TypeScript for type safety
- Mock data generation for testing

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Socket.io-client for real-time updates
- Framer Motion for animations

## Development

### Type Checking

Check TypeScript types without building:

```bash
# Backend
cd backend && npm run type-check

# Frontend
cd frontend && npm run type-check
```

### Building for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## Configuration

### Backend (.env)
```
PORT=3001
CORS_ORIGIN=http://localhost:5173
USE_MOCK_DATA=true
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/scoreboard` - Current scoreboard data
- `POST /api/refresh` - Manually trigger data refresh

## Competing Managers

1. Nick A. - South Korea 🇰🇷 / Latvia 🇱🇻 / Great Britain 🇬🇧
2. Scott - Great Britain 🇬🇧 / Spain 🇪🇸 / South Korea 🇰🇷
3. Steve - Finland 🇫🇮 / Hungary 🇭🇺 / Latvia 🇱🇻
4. Kerry - Slovenia 🇸🇮 / Poland 🇵🇱 / Finland 🇫🇮
5. Adam - New Zealand 🇳🇿 / Belgium 🇧🇪 / Slovenia 🇸🇮
6. Nick W. - Australia 🇦🇺 / Czech Republic 🇨🇿 / New Zealand 🇳🇿
7. Zach - Hungary 🇭🇺 / Great Britain 🇬🇧 / Australia 🇦🇺
8. Gabe - Belgium 🇧🇪 / Slovenia 🇸🇮 / Hungary 🇭🇺
9. Lexi - Czech Republic 🇨🇿 / Australia 🇦🇺 / Belgium 🇧🇪
10. Phil - Slovakia 🇸🇰 / New Zealand 🇳🇿 / Poland 🇵🇱
11. Chris - Poland 🇵🇱 / Finland 🇫🇮 / Czech Republic 🇨🇿
12. Eric - Spain 🇪🇸 / South Korea 🇰🇷 / Slovakia 🇸🇰

## Deployment

This application can be deployed to Render as a **single unified service** (free tier available).

The backend serves the frontend static files, giving you:
- ✅ One service to deploy (not two)
- ✅ No CORS issues (same origin)
- ✅ Simpler configuration
- ✅ Single URL for everything

**Quick Start:**
1. See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide
2. Use [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) for step-by-step checklist

**What you need:**
- GitHub account
- Render account (free)
- 10 minutes

**Deploy Commands:**
```bash
Build: npm run build
Start: npm start
```

The root `package.json` orchestrates building both backend and frontend with all necessary dependencies.

The application runs on Render's free tier with automatic deployments from GitHub.

## License

MIT
