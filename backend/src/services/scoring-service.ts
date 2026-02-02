import { Team, TeamScore, MedalTableEntry, TeamCountryMedals } from '../types';

function getMedalCountForCountry(
  medalData: MedalTableEntry[],
  countryCode: string
): { gold: number; silver: number; bronze: number } {
  const countryData = medalData.find(entry => entry.code === countryCode);
  return countryData?.medals || { gold: 0, silver: 0, bronze: 0 };
}

export function calculateScores(
  teams: Team[],
  medalData: MedalTableEntry[]
): TeamScore[] {
  return teams.map(team => {
    const goldCountryMedals = getMedalCountForCountry(medalData, team.goldCountry.code);
    const silverCountryMedals = getMedalCountForCountry(medalData, team.silverCountry.code);
    const bronzeCountryMedals = getMedalCountForCountry(medalData, team.bronzeCountry.code);

    const goldPoints = goldCountryMedals.gold * 3;
    const silverPoints = silverCountryMedals.silver * 2;
    const bronzePoints = bronzeCountryMedals.bronze * 1;

    const goldCountryMedalsData: TeamCountryMedals = {
      country: team.goldCountry,
      medalType: 'gold',
      count: goldCountryMedals.gold,
      points: goldPoints
    };

    const silverCountryMedalsData: TeamCountryMedals = {
      country: team.silverCountry,
      medalType: 'silver',
      count: silverCountryMedals.silver,
      points: silverPoints
    };

    const bronzeCountryMedalsData: TeamCountryMedals = {
      country: team.bronzeCountry,
      medalType: 'bronze',
      count: bronzeCountryMedals.bronze,
      points: bronzePoints
    };

    return {
      team,
      totalPoints: goldPoints + silverPoints + bronzePoints,
      goldCountryMedals: goldCountryMedalsData,
      silverCountryMedals: silverCountryMedalsData,
      bronzeCountryMedals: bronzeCountryMedalsData
    };
  });
}

export function rankTeams(scores: TeamScore[]): TeamScore[] {
  const sorted = [...scores].sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }

    if (a.goldCountryMedals.count !== b.goldCountryMedals.count) {
      return b.goldCountryMedals.count - a.goldCountryMedals.count;
    }

    if (a.silverCountryMedals.count !== b.silverCountryMedals.count) {
      return b.silverCountryMedals.count - a.silverCountryMedals.count;
    }

    if (a.bronzeCountryMedals.count !== b.bronzeCountryMedals.count) {
      return b.bronzeCountryMedals.count - a.bronzeCountryMedals.count;
    }

    return a.team.tiebreakerRank - b.team.tiebreakerRank;
  });

  return sorted.map((score, index) => ({
    ...score,
    rank: index + 1
  }));
}
