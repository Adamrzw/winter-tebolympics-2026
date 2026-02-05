import { MedalTableEntry } from '../types/index.js';
import { fetchYahooMedalData } from './yahoo-api-service.js';
import { config } from '../config/config.js';

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

/**
 * Fetches medal data - either from Yahoo API or generates mock data
 * based on the useMockData configuration
 */
export async function getMedalData(): Promise<MedalTableEntry[]> {
  if (config.useMockData) {
    console.log('Using mock medal data');
    return generateMockMedalData();
  } else {
    console.log('Fetching real medal data from Yahoo API');
    return await fetchYahooMedalData();
  }
}
