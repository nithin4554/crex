import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import type { InsertMatch } from "@shared/schema";

const CRICKET_API_KEY = process.env.CRICKET_API_KEY || "demo_key";
const API_BASE_URL = "https://api.cricapi.com/v1";

async function fetchMatches() {
  try {
    const response = await axios.get(`${API_BASE_URL}/matches`, {
      params: { apikey: CRICKET_API_KEY },
    });

    if (!response.data || !response.data.data) {
      console.error("Invalid API response format:", response.data);
      return [];
    }

    return response.data.data.map((match: any) => ({
      id: match.id,
      teamA: match.teams?.[0] || "Team A",
      teamB: match.teams?.[1] || "Team B",
      scoreA: match.score?.[0] || "0/0",
      scoreB: match.score?.[1] || "0/0",
      overs: match.overs || "0.0",
      status: match.status || "UPCOMING",
      venue: match.venue || "TBD",
      startTime: match.dateTimeGMT || new Date().toISOString(),
      partnership: match.partnership,
      runRate: parseFloat(match.runRate) || 0,
      requiredRate: parseFloat(match.requiredRunRate) || 0
    }));
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Fetch and cache live matches
  app.get("/api/matches", async (_req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Get single match details
  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        res.status(404).json({ error: "Match not found" });
        return;
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  // Update cache every 30 seconds
  setInterval(async () => {
    try {
      const apiMatches = await fetchMatches();

      for (const match of apiMatches) {
        const insertMatch: InsertMatch = {
          matchId: match.id,
          teamA: match.teamA,
          teamB: match.teamB,
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          overs: match.overs,
          status: match.status,
          venue: match.venue,
          startTime: new Date(match.startTime),
          lastUpdated: new Date(),
          stats: {
            partnership: match.partnership,
            runRate: match.runRate,
            requiredRate: match.requiredRate,
            commentary: []
          }
        };

        const cached = await storage.getMatch(match.id);
        if (cached) {
          await storage.updateMatch(match.id, {
            ...cached,
            scoreA: match.scoreA,
            scoreB: match.scoreB,
            overs: match.overs,
            status: match.status,
            lastUpdated: new Date(),
            stats: {
              ...cached.stats,
              partnership: match.partnership,
              runRate: match.runRate,
              requiredRate: match.requiredRate
            }
          });
        } else {
          await storage.cacheMatch(insertMatch);
        }
      }
    } catch (error) {
      console.error("Error updating matches:", error);
    }
  }, 30000);

  return httpServer;
}