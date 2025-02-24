import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { StatsChart } from "@/components/stats-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Match } from "@shared/schema";
import { getMatch } from "@/lib/api";

export default function Match() {
  const { id } = useParams();

  const { data: match, isLoading } = useQuery<Match>({
    queryKey: [`/api/matches/${id}`],
    queryFn: () => getMatch(id!),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-48 rounded-lg bg-muted mb-6" />
        <div className="h-96 rounded-lg bg-muted" />
      </div>
    );
  }

  if (!match) {
    return <div>Match not found</div>;
  }

  const runRateData = Array.from({ length: 20 }, (_, i) => ({
    over: i + 1,
    runRate: match.stats.runRate || 0,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{match.teamA} vs {match.teamB}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold">{match.teamA}</h3>
              <p className="text-2xl">{match.scoreA}</p>
            </div>
            <div>
              <h3 className="font-bold">{match.teamB}</h3>
              <p className="text-2xl">{match.scoreB}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Overs: {match.overs}</p>
            {match.stats.partnership && (
              <p>Current Partnership: {match.stats.partnership}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart data={runRateData} />

        <Card>
          <CardHeader>
            <CardTitle>Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {match.stats.commentary?.map((comment, index) => (
                <p key={index} className="mb-2 text-sm">{comment}</p>
              )) || <p>No commentary available</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}