import { useQuery } from "@tanstack/react-query";
import { MatchCard } from "@/components/match-card";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import type { Match } from "@shared/schema";
import { getMatches } from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    queryFn: getMatches,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const filteredMatches = matches.filter((match) => {
    const query = searchQuery.toLowerCase();
    return (
      match.teamA.toLowerCase().includes(query) ||
      match.teamB.toLowerCase().includes(query) ||
      match.venue.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cricket Live Scores</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SearchBar onSearch={setSearchQuery} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}