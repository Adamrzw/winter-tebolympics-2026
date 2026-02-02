import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScoreboardData } from '../types';

// In production, connect to same origin; in dev, use VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

export function useSocket() {
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket: Socket = io(API_URL);

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to server');
      setConnected(false);
    });

    socket.on('scoreUpdate', (data: ScoreboardData) => {
      console.log('Received score update');
      setScoreboardData(data);
      setError(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { scoreboardData, connected, error };
}
