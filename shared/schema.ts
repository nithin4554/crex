import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  matchId: text("match_id").notNull().unique(),
  teamA: text("team_a").notNull(),
  teamB: text("team_b").notNull(),
  scoreA: text("score_a").notNull(),
  scoreB: text("score_b").notNull(),
  overs: text("overs").notNull(),
  status: text("status").notNull(),
  venue: text("venue").notNull(),
  startTime: timestamp("start_time").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  stats: json("stats").$type<{
    partnership?: string;
    runRate?: number;
    requiredRate?: number;
    commentary?: string[];
  }>().notNull(),
});

export const matchSchema = createInsertSchema(matches).omit({ id: true });

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof matchSchema>;

export interface MatchStats {
  partnership?: string;
  runRate?: number;
  requiredRate?: number;
  commentary?: string[];
}
