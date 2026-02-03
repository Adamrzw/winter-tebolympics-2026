import { useEffect, useState } from 'react';
import { formatTimestamp, formatCountdown } from '../utils/format';
import './UpdateInfo.css';

interface UpdateInfoProps {
  lastUpdate: string;
  nextUpdate: string;
  view: 'cards' | 'table';
  onToggle: (view: 'cards' | 'table') => void;
}

export function UpdateInfo({ lastUpdate, nextUpdate, view, onToggle }: UpdateInfoProps) {
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const next = new Date(nextUpdate).getTime();
      const diff = Math.max(0, Math.floor((next - now) / 1000));
      setCountdown(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextUpdate]);

  return (
    <div className="update-info">
      <div className="update-details">
        <div className="update-item">
          <span className="update-label">Updated:</span>
          <span className="update-value">{formatTimestamp(lastUpdate)}</span>
        </div>
        <div className="update-item">
          <span className="update-label">Next:</span>
          <span className="update-value countdown">{formatCountdown(countdown)}</span>
        </div>
      </div>
      <div className="view-toggle">
        <button
          className={`toggle-btn ${view === 'cards' ? 'active' : ''}`}
          onClick={() => onToggle('cards')}
          aria-label="Card view"
          title="Card view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          className={`toggle-btn ${view === 'table' ? 'active' : ''}`}
          onClick={() => onToggle('table')}
          aria-label="Table view"
          title="Table view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
