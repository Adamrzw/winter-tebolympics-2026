import fs from 'fs/promises';
import path from 'path';
import { MedalTableEntry } from '../types';

const MEDAL_DATA_PATH = path.join(__dirname, '../data/medal-data.json');

export async function loadMedalData(): Promise<MedalTableEntry[] | null> {
  try {
    const data = await fs.readFile(MEDAL_DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    console.error('Error loading medal data:', error);
    throw error;
  }
}

export async function saveMedalData(data: MedalTableEntry[]): Promise<void> {
  try {
    const tempPath = `${MEDAL_DATA_PATH}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, MEDAL_DATA_PATH);
  } catch (error) {
    console.error('Error saving medal data:', error);
    throw error;
  }
}
