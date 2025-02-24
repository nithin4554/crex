import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import type { InsertMatch } from "@shared/schema";

const CRICKET_API_KEY = process.env.CRICKET_API_KEY || "demo_key";
const API_BASE_URL = "https://api.cricapi.com/v1";

async function fetchMatches() {
  try {
    console.log("Fetching matches from Cricket API...");
    const response = await axios.get(`${API_BASE_URL}/matches`, {
      params: { apikey: CRICKET_API_KEY },
    });

    if (!response.data || !response.data.data) {
      console.error("Invalid API response format:", response.data);
      return [];
    }

    console.log(`Fetched ${response.data.data.length} matches`);
    return response.data.data.map((match: any) => ({
      id: match.id,
      teamA: match.teamInfo?.[0]?.name || match.teams?.[0] || "Team A",
      teamB: match.teamInfo?.[1]?.name || match.teams?.[1] || "Team B",
      scoreA: match.score?.[0]?.r ? `${match.score[0].r}/${match.score[0].w || 0} (${match.score[0].o || 0})` : "Yet to bat",
      scoreB: match.score?.[1]?.r ? `${match.score[1].r}/${match.score[1].w || 0} (${match.score[1].o || 0})` : "Yet to bat",
      overs: match.overs || "0.0",
      status: match.status || "UPCOMING",
      venue: match.venue || "TBD",
      startTime: match.dateTimeGMT || new Date().toISOString(),
      partnership: match.partnership,
      runRate: parseFloat(match.runRate) || 0,
      requiredRate: parseFloat(match.requiredRunRate) || 0
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("Error fetching matches:", error);
    }
    return [];
  }
}

async function updateMatchesCache() {
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
    console.error("Error updating matches cache:", error);
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
      console.error("Error serving matches:", error);
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
      console.error("Error serving match details:", error);
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  // Initial fetch of matches
  await updateMatchesCache();

  // Update cache every 30 seconds
  setInterval(updateMatchesCache, 30000);

  return httpServer;
}