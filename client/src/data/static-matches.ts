import type { Match } from "@shared/schema";

export const staticMatches: Match[] = [
  {
    id: 1,
    matchId: "t20-wc-2024-01",
    teamA: "India",
    teamB: "Australia",
    scoreA: "185/4 (20.0)",
    scoreB: "180/8 (20.0)",
    overs: "20.0",
    status: "COMPLETED",
    venue: "Melbourne Cricket Ground",
    startTime: new Date("2024-02-26T09:30:00Z"),
    lastUpdated: new Date("2024-02-26T12:30:00Z"),
    stats: {
      partnership: "45(28)",
      runRate: 9.25,
      requiredRate: 0,
      commentary: [
        "20.0: Match completed - India wins by 5 runs",
        "19.6: Smith c Kohli b Bumrah 45(28)",
        "19.1: Six! Maxwell hits it over long-on"
      ]
    }
  },
  {
    id: 2,
    matchId: "test-2024-02",
    teamA: "England",
    teamB: "South Africa",
    scoreA: "320/4 (75.0)",
    scoreB: "Yet to bat",
    overs: "75.0",
    status: "LIVE",
    venue: "Lord's Cricket Ground",
    startTime: new Date("2024-02-26T10:00:00Z"),
    lastUpdated: new Date("2024-02-26T12:30:00Z"),
    stats: {
      partnership: "120(180)",
      runRate: 4.27,
      requiredRate: 0,
      commentary: [
        "75.0: Tea break - England in a strong position",
        "74.6: Root brings up his century with a classic cover drive",
        "74.1: New ball taken by South Africa"
      ]
    }
  },
  {
    id: 3,
    matchId: "odi-2024-03",
    teamA: "New Zealand",
    teamB: "Pakistan",
    scoreA: "Yet to bat",
    scoreB: "Yet to bat",
    overs: "0.0",
    status: "UPCOMING",
    venue: "Eden Park, Auckland",
    startTime: new Date("2024-02-27T01:30:00Z"),
    lastUpdated: new Date("2024-02-26T12:30:00Z"),
    stats: {
      runRate: 0,
      requiredRate: 0,
      commentary: []
    }
  }
];
