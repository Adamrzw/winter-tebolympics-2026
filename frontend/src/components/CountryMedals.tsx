import { TeamCountryMedals } from '../types';
import './CountryMedals.css';

interface CountryMedalsProps {
  data: TeamCountryMedals;
}

const COUNTRY_FLAGS: Record<string, string> = {
  'KOR': '🇰🇷',
  'LVA': '🇱🇻',
  'GBR': '🇬🇧',
  'ESP': '🇪🇸',
  'FIN': '🇫🇮',
  'HUN': '🇭🇺',
  'SVN': '🇸🇮',
  'POL': '🇵🇱',
  'NZL': '🇳🇿',
  'BEL': '🇧🇪',
  'AUS': '🇦🇺',
  'CZE': '🇨🇿',
  'SVK': '🇸🇰'
};

export function CountryMedals({ data }: CountryMedalsProps) {
  const flag = COUNTRY_FLAGS[data.country.code] || '🏳️';
  const medalEmoji = data.medalType === 'gold' ? '🥇' : data.medalType === 'silver' ? '🥈' : '🥉';

  return (
    <div className={`country-medals ${data.medalType}`}>
      <div className="country-info">
        <span className="country-flag">{flag}</span>
        <div className="country-details">
          <span className="country-name">{data.country.name}</span>
          <span className="medal-type">{medalEmoji} {data.medalType.toUpperCase()}</span>
        </div>
      </div>
      <div className="medal-stats">
        <span className="medal-count">{data.count} medals</span>
        <span className="medal-points">{data.points} pts</span>
      </div>
    </div>
  );
}
