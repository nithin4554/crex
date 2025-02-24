import { useQuery } from "@tanstack/react-query";
import { MatchCard } from "@/components/match-card";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import type { Match } from "@shared/schema";
import { getMatches } from "@/lib/api";
import { Loader2 } from "lucide-react";

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
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            International Cricket Live
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8">
          <SearchBar onSearch={setSearchQuery} />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing {filteredMatches.length} international matches
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No matches found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or check back later
            </p>
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