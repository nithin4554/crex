import type { Match } from "@shared/schema";
import { staticMatches } from "../data/static-matches";

export async function getMatches(): Promise<Match[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return staticMatches;
}

export async function getMatch(id: string): Promise<Match> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const match = staticMatches.find(m => m.matchId === id);
  if (!match) {
    throw new Error("Match not found");
  }
  return match;
}