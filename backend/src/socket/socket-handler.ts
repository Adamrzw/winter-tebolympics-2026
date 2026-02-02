import { Server as SocketServer, Socket } from 'socket.io';
import { ScoreboardData } from '../types';

let currentScoreboardData: ScoreboardData | null = null;
const throttleMap = new Map<string, number>();
const THROTTLE_MS = 1000;

export function initializeSocketHandler(io: SocketServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    if (currentScoreboardData) {
      socket.emit('scoreUpdate', currentScoreboardData);
    }

    socket.on('requestUpdate', () => {
      const lastRequest = throttleMap.get(socket.id) || 0;
      const now = Date.now();

      if (now - lastRequest < THROTTLE_MS) {
        return;
      }

      throttleMap.set(socket.id, now);

      if (currentScoreboardData) {
        socket.emit('scoreUpdate', currentScoreboardData);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      throttleMap.delete(socket.id);
    });
  });
}

export function broadcastScoreUpdate(io: SocketServer, data: ScoreboardData) {
  currentScoreboardData = data;
  io.emit('scoreUpdate', data);
}

export function getCurrentScoreboardData(): ScoreboardData | null {
  return currentScoreboardData;
}

export function setCurrentScoreboardData(data: ScoreboardData) {
  currentScoreboardData = data;
}
