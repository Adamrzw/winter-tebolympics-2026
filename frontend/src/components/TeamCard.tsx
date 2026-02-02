import { TeamScore } from '../types';
import { CountryMedals } from './CountryMedals';
import './TeamCard.css';

interface TeamCardProps {
  teamScore: TeamScore;
}

export function TeamCard({ teamScore }: TeamCardProps) {
  const { team, totalPoints, rank, goldCountryMedals, silverCountryMedals, bronzeCountryMedals } = teamScore;

  const getRankClass = () => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  const getRankEmoji = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className={`team-card ${getRankClass()}`}>
      <div className="team-header">
        <div className="team-rank">
          <span className="rank-number">#{rank}</span>
          <span className="rank-emoji">{getRankEmoji()}</span>
        </div>
        <div className="team-info">
          <h2 className="team-name">{team.managerName}</h2>
          <div className="team-points">{totalPoints} points</div>
        </div>
      </div>
      <div className="team-countries">
        <CountryMedals data={goldCountryMedals} />
        <CountryMedals data={silverCountryMedals} />
        <CountryMedals data={bronzeCountryMedals} />
      </div>
    </div>
  );
}
