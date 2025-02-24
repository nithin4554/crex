import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Match } from "@shared/schema";
import { format } from "date-fns";
import { TrendingUp, MapPin, Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'LIVE':
        return "destructive";
      case 'COMPLETED':
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Link href={`/match/${match.matchId}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <Badge variant={getStatusColor(match.status)}>
            {match.status}
          </Badge>
          {match.stats.runRate > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-1" />
              RR: {match.stats.runRate.toFixed(2)}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{match.teamA}</h3>
                <span className="font-mono">{match.scoreA}</span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{match.teamB}</h3>
                <span className="font-mono">{match.scoreB}</span>
              </div>
            </div>

            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {match.venue}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                {format(new Date(match.startTime), "PPp")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}