import { matches, type Match, type InsertMatch, type MatchStats } from "@shared/schema";

export interface IStorage {
  getMatches(): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  updateMatch(id: string, data: Partial<Match>): Promise<Match>;
  cacheMatch(match: InsertMatch): Promise<Match>;
}

export class MemStorage implements IStorage {
  private matches: Map<string, Match>;
  private currentId: number;

  constructor() {
    this.matches = new Map();
    this.currentId = 1;
  }

  async getMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async updateMatch(id: string, data: Partial<Match>): Promise<Match> {
    const match = this.matches.get(id);
    if (!match) {
      throw new Error("Match not found");
    }
    const updated = { ...match, ...data };
    this.matches.set(id, updated);
    return updated;
  }

  async cacheMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentId++;
    const newMatch: Match = {
      id,
      matchId: match.matchId,
      teamA: match.teamA,
      teamB: match.teamB,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
      overs: match.overs,
      status: match.status,
      venue: match.venue,
      startTime: match.startTime,
      lastUpdated: match.lastUpdated,
      stats: match.stats
    };
    this.matches.set(match.matchId, newMatch);
    return newMatch;
  }
}

export const storage = new MemStorage();