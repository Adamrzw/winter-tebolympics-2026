import { MedalTableEntry } from '../types/index.js';

const YAHOO_API_URL = 'https://graphite.sports.yahoo.com/v1/query/shangrila/OlyMedalCount';
const YAHOO_API_PARAMS = {
  lang: 'en-US',
  region: 'US',
  tz: 'America/New_York',
  ysp_platform: 'next-app-sports',
  season: '2026',
  sortMethod: 'GOLD'
};

// Yahoo API response types
interface YahooCountryDetails {
  name: string;
  isoCode: string;
  iocCode: string;
  flagImage?: Array<{ url: string }>;
}

interface YahooOlympicTeam {
  countryDetails: YahooCountryDetails;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  rank: number;
  isRankTie: boolean | null;
}

interface YahooOlympicsData {
  displayName: string;
  shortDisplayName: string;
  startDate: string;
  endDate: string;
  season: number;
  alias: string | null;
  olympicTeam: YahooOlympicTeam[];
}

interface YahooApiResponse {
  data: {
    olympics: YahooOlympicsData[];
  };
}

/**
 * Maps Yahoo API olympic team data to our MedalTableEntry format
 */
function mapYahooTeamToMedalEntry(yahooTeam: YahooOlympicTeam): MedalTableEntry {
  return {
    code: yahooTeam.countryDetails.isoCode,
    name: yahooTeam.countryDetails.name,
    medals: {
      gold: yahooTeam.gold,
      silver: yahooTeam.silver,
      bronze: yahooTeam.bronze
    }
  };
}

/**
 * Fetches real-time medal data from Yahoo Sports API
 */
export async function fetchYahooMedalData(): Promise<MedalTableEntry[]> {
  try {
    // Build URL with query parameters
    const url = new URL(YAHOO_API_URL);
    Object.entries(YAHOO_API_PARAMS).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    console.log('Fetching medal data from Yahoo API...');
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Yahoo API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as YahooApiResponse;

    // Extract the first (and typically only) olympics data
    const olympicsData = data.data?.olympics?.[0];
    if (!olympicsData || !olympicsData.olympicTeam) {
      throw new Error('Invalid response structure from Yahoo API');
    }

    // Map all teams to our format
    const medalData = olympicsData.olympicTeam.map(mapYahooTeamToMedalEntry);

    console.log(`Successfully fetched medal data for ${medalData.length} countries`);
    return medalData;

  } catch (error) {
    console.error('Error fetching Yahoo medal data:', error);
    throw new Error(`Failed to fetch medal data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
