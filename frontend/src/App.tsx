import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { Header } from './components/Header';
import { UpdateInfo } from './components/UpdateInfo';
import { Scoreboard } from './components/Scoreboard';
import { TableView } from './components/TableView';
import './App.css';

export function App() {
  const { scoreboardData, connected, error } = useSocket();
  const [view, setView] = useState<'cards' | 'table'>('cards');

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <h2>Connection Error</h2>
            <p>{error}</p>
            <p className="error-hint">Make sure the backend server is running on port 3001</p>
          </div>
        </div>
      </div>
    );
  }

  if (!connected || !scoreboardData) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <UpdateInfo
        lastUpdate={scoreboardData.lastUpdate}
        nextUpdate={scoreboardData.nextUpdate}
        view={view}
        onToggle={setView}
      />
      {view === 'cards' ? (
        <Scoreboard teams={scoreboardData.teams} />
      ) : (
        <TableView teams={scoreboardData.teams} />
      )}
    </div>
  );
}
