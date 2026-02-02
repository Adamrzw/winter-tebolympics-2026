export interface Country {
  code: string;
  name: string;
}

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export interface MedalTableEntry extends Country {
  medals: MedalCount;
}

export interface TeamCountryMedals {
  country: Country;
  medalType: 'gold' | 'silver' | 'bronze';
  count: number;
  points: number;
}

export interface Team {
  id: string;
  managerName: string;
  goldCountry: Country;
  silverCountry: Country;
  bronzeCountry: Country;
  tiebreakerRank: number;
}

export interface TeamScore {
  team: Team;
  totalPoints: number;
  goldCountryMedals: TeamCountryMedals;
  silverCountryMedals: TeamCountryMedals;
  bronzeCountryMedals: TeamCountryMedals;
  rank?: number;
}

export interface ScoreboardData {
  teams: TeamScore[];
  lastUpdate: string;
  nextUpdate: string;
}
