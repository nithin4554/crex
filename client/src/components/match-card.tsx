import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Match } from "@shared/schema";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link href={`/match/${match.matchId}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row justify-between items-center">
          <h3 className="font-bold text-lg">{match.teamA} vs {match.teamB}</h3>
          <Badge variant={match.status === "LIVE" ? "destructive" : "secondary"}>
            {match.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{match.scoreA}</span>
              <span>{match.scoreB}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>{match.venue}</div>
              <div>
                {format(new Date(match.startTime), "PPP")}
              </div>
            </div>
            {match.stats.runRate && (
              <div className="text-sm">
                RR: {match.stats.runRate.toFixed(2)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
