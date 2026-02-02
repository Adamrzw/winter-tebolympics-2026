import './ViewToggle.css';

interface ViewToggleProps {
  view: 'cards' | 'table';
  onToggle: (view: 'cards' | 'table') => void;
}

export function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${view === 'cards' ? 'active' : ''}`}
        onClick={() => onToggle('cards')}
        aria-label="Card view"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        Cards
      </button>
      <button
        className={`toggle-btn ${view === 'table' ? 'active' : ''}`}
        onClick={() => onToggle('table')}
        aria-label="Table view"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Table
      </button>
    </div>
  );
}
