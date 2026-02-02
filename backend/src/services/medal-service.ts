import { MedalTableEntry } from '../types';

const COUNTRIES = [
  { code: 'KOR', name: 'South Korea' },
  { code: 'LVA', name: 'Latvia' },
  { code: 'GBR', name: 'Great Britain' },
  { code: 'ESP', name: 'Spain' },
  { code: 'FIN', name: 'Finland' },
  { code: 'HUN', name: 'Hungary' },
  { code: 'SVN', name: 'Slovenia' },
  { code: 'POL', name: 'Poland' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'AUS', name: 'Australia' },
  { code: 'CZE', name: 'Czech Republic' },
  { code: 'SVK', name: 'Slovakia' }
];

function randomMedalCount(): number {
  return Math.floor(Math.random() * 21);
}

export function generateMockMedalData(): MedalTableEntry[] {
  return COUNTRIES.map(country => ({
    ...country,
    medals: {
      gold: randomMedalCount(),
      silver: randomMedalCount(),
      bronze: randomMedalCount()
    }
  }));
}
