import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

const CRICKET_API_KEY = process.env.CRICKET_API_KEY || "demo_key";
const API_BASE_URL = "https://api.cricapi.com/v1";

async function fetchMatches() {
  try {
    const response = await axios.get(`${API_BASE_URL}/matches`, {
      params: { apikey: CRICKET_API_KEY },
    });
    return response.data.matches;
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
        const cached = await storage.getMatch(match.id);
        if (cached) {
          await storage.updateMatch(match.id, {
            ...cached,
            scoreA: match.scoreA,
            scoreB: match.scoreB,
            overs: match.overs,
            status: match.status,
            lastUpdated: new Date(),
          });
        } else {
          await storage.cacheMatch({
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
              commentary: [],
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating matches:", error);
    }
  }, 30000);

  return httpServer;
}
