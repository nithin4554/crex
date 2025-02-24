import { apiRequest } from "./queryClient";
import type { Match } from "@shared/schema";

export async function getMatches(): Promise<Match[]> {
  const res = await apiRequest("GET", "/api/matches");
  return res.json();
}

export async function getMatch(id: string): Promise<Match> {
  const res = await apiRequest("GET", `/api/matches/${id}`);
  return res.json();
}
