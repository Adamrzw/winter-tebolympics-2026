import { useEffect, useState } from 'react';
import { formatTimestamp, formatCountdown } from '../utils/format';
import './UpdateInfo.css';

interface UpdateInfoProps {
  lastUpdate: string;
  nextUpdate: string;
}

export function UpdateInfo({ lastUpdate, nextUpdate }: UpdateInfoProps) {
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
      <div className="update-item">
        <span className="update-label">Last Update:</span>
        <span className="update-value">{formatTimestamp(lastUpdate)}</span>
      </div>
      <div className="update-item">
        <span className="update-label">Next Update In:</span>
        <span className="update-value countdown">{formatCountdown(countdown)}</span>
      </div>
    </div>
  );
}
