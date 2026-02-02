import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import { Team, MedalTableEntry, ScoreboardData } from './types/index.js';
import { generateMockMedalData } from './services/medal-service.js';
import { loadMedalData, saveMedalData } from './services/storage-service.js';
import { calculateScores, rankTeams } from './services/scoring-service.js';
import {
  initializeSocketHandler,
  broadcastScoreUpdate,
  getCurrentScoreboardData,
  setCurrentScoreboardData
} from './socket/socket-handler.js';
import teamsData from './data/teams.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Support multiple CORS origins for production
const corsOrigins = config.corsOrigin.split(',').map(origin => origin.trim());

const io = new SocketServer(httpServer, {
  cors: {
    origin: corsOrigins.length > 1 ? corsOrigins : config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: corsOrigins.length > 1 ? corsOrigins : config.corsOrigin,
  credentials: true
}));
app.use(express.json());

const teams: Team[] = teamsData as Team[];

async function updateScoreboard(): Promise<ScoreboardData> {
  let medalData: MedalTableEntry[];

  if (config.useMockData) {
    medalData = generateMockMedalData();
    await saveMedalData(medalData);
  } else {
    const loaded = await loadMedalData();
    if (loaded) {
      medalData = loaded;
    } else {
      medalData = generateMockMedalData();
      await saveMedalData(medalData);
    }
  }

  const scores = calculateScores(teams, medalData);
  const rankedScores = rankTeams(scores);

  const now = new Date();
  const nextUpdate = new Date(now.getTime() + config.updateInterval);

  const scoreboardData: ScoreboardData = {
    teams: rankedScores,
    lastUpdate: now.toISOString(),
    nextUpdate: nextUpdate.toISOString()
  };

  return scoreboardData;
}

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/scoreboard', async (req: Request, res: Response) => {
  try {
    const data = getCurrentScoreboardData();
    if (data) {
      res.json(data);
    } else {
      const newData = await updateScoreboard();
      setCurrentScoreboardData(newData);
      res.json(newData);
    }
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    res.status(500).json({ error: 'Failed to fetch scoreboard' });
  }
});

app.post('/api/refresh', async (req: Request, res: Response) => {
  try {
    const data = await updateScoreboard();
    setCurrentScoreboardData(data);
    broadcastScoreUpdate(io, data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({ error: 'Failed to refresh data' });
  }
});

// Serve static frontend files in production
if (config.nodeEnv === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  // Handle client-side routing - send index.html for all non-API routes
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

initializeSocketHandler(io);

async function startUpdateInterval() {
  const data = await updateScoreboard();
  setCurrentScoreboardData(data);
  broadcastScoreUpdate(io, data);

  setInterval(async () => {
    try {
      const newData = await updateScoreboard();
      setCurrentScoreboardData(newData);
      broadcastScoreUpdate(io, newData);
      console.log('Scoreboard updated at', new Date().toISOString());
    } catch (error) {
      console.error('Error updating scoreboard:', error);
    }
  }, config.updateInterval);
}

httpServer.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);
  await startUpdateInterval();
});
