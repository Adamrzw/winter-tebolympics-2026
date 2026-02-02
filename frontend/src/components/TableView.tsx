import { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamScore } from '../types';
import './TableView.css';

interface TableViewProps {
  teams: TeamScore[];
}

type SortColumn = 'rank' | 'manager' | 'total' | 'gold' | 'silver' | 'bronze' | 'goldCountry' | 'silverCountry' | 'bronzeCountry';
type SortDirection = 'asc' | 'desc';

export function TableView({ teams }: TableViewProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    let comparison = 0;

    switch (sortColumn) {
      case 'rank':
        comparison = (a.rank || 0) - (b.rank || 0);
        break;
      case 'manager':
        comparison = a.team.managerName.localeCompare(b.team.managerName);
        break;
      case 'total':
        comparison = a.totalPoints - b.totalPoints;
        break;
      case 'gold':
        comparison = a.goldCountryMedals.count - b.goldCountryMedals.count;
        break;
      case 'silver':
        comparison = a.silverCountryMedals.count - b.silverCountryMedals.count;
        break;
      case 'bronze':
        comparison = a.bronzeCountryMedals.count - b.bronzeCountryMedals.count;
        break;
      case 'goldCountry':
        comparison = a.goldCountryMedals.country.name.localeCompare(b.goldCountryMedals.country.name);
        break;
      case 'silverCountry':
        comparison = a.silverCountryMedals.country.name.localeCompare(b.silverCountryMedals.country.name);
        break;
      case 'bronzeCountry':
        comparison = a.bronzeCountryMedals.country.name.localeCompare(b.bronzeCountryMedals.country.name);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <span className="sort-icon">↕</span>;
    }
    return <span className="sort-icon active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const getRankClass = (rank?: number) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  const getRankEmoji = (rank?: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="table-view-container">
      <div className="table-scroll">
        <table className="scoreboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rank')} className="sortable">
                Rank <SortIcon column="rank" />
              </th>
              <th onClick={() => handleSort('manager')} className="sortable">
                Manager <SortIcon column="manager" />
              </th>
              <th onClick={() => handleSort('total')} className="sortable">
                Total Points <SortIcon column="total" />
              </th>
              <th onClick={() => handleSort('goldCountry')} className="sortable">
                Gold Country <SortIcon column="goldCountry" />
              </th>
              <th onClick={() => handleSort('gold')} className="sortable">
                Gold 🥇 <SortIcon column="gold" />
              </th>
              <th onClick={() => handleSort('silverCountry')} className="sortable">
                Silver Country <SortIcon column="silverCountry" />
              </th>
              <th onClick={() => handleSort('silver')} className="sortable">
                Silver 🥈 <SortIcon column="silver" />
              </th>
              <th onClick={() => handleSort('bronzeCountry')} className="sortable">
                Bronze Country <SortIcon column="bronzeCountry" />
              </th>
              <th onClick={() => handleSort('bronze')} className="sortable">
                Bronze 🥉 <SortIcon column="bronze" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((teamScore) => (
              <motion.tr
                key={teamScore.team.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={getRankClass(teamScore.rank)}
              >
                <td className="rank-cell">
                  <span className="rank-number">#{teamScore.rank}</span>
                  <span className="rank-emoji">{getRankEmoji(teamScore.rank)}</span>
                </td>
                <td className="manager-cell">{teamScore.team.managerName}</td>
                <td className="points-cell">
                  <strong>{teamScore.totalPoints}</strong> pts
                </td>
                <td className="country-cell">
                  {teamScore.goldCountryMedals.country.name}
                </td>
                <td className="medal-cell gold-medal">
                  <div className="medal-info">
                    <span className="medal-count">{teamScore.goldCountryMedals.count}</span>
                    <span className="medal-points">({teamScore.goldCountryMedals.points} pts)</span>
                  </div>
                </td>
                <td className="country-cell">
                  {teamScore.silverCountryMedals.country.name}
                </td>
                <td className="medal-cell silver-medal">
                  <div className="medal-info">
                    <span className="medal-count">{teamScore.silverCountryMedals.count}</span>
                    <span className="medal-points">({teamScore.silverCountryMedals.points} pts)</span>
                  </div>
                </td>
                <td className="country-cell">
                  {teamScore.bronzeCountryMedals.country.name}
                </td>
                <td className="medal-cell bronze-medal">
                  <div className="medal-info">
                    <span className="medal-count">{teamScore.bronzeCountryMedals.count}</span>
                    <span className="medal-points">({teamScore.bronzeCountryMedals.points} pts)</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
