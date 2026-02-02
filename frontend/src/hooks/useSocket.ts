import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScoreboardData } from '../types';

// Determine API URL based on environment
// In production (served from same origin), always use window.location.origin
// In development, use VITE_API_URL if set, otherwise default to localhost:3001
const getApiUrl = () => {
  // If running on localhost:5173 (Vite dev server), use the backend URL
  if (window.location.hostname === 'localhost' && window.location.port === '5173') {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }
  // Otherwise, use same origin (production or localhost:3001)
  return window.location.origin;
};

const API_URL = getApiUrl();

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
