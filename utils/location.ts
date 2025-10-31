import { University } from '../types';

export const getUniqueStates = (universities: University[]): string[] => {
  const states = new Set(universities.map(uni => uni.state));
  return Array.from(states).sort();
};
