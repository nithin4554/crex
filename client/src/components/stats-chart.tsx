import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RunRateData {
  over: number;
  runRate: number;
}

interface StatsChartProps {
  data: RunRateData[];
}

export function StatsChart({ data }: StatsChartProps) {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Run Rate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="over" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="runRate" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
