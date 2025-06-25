
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Game, Gameplay } from "@/types"

interface UserGameChartProps {
  game: Game
  gameplays: Gameplay[]
}

export function UserGameChart({ game, gameplays }: UserGameChartProps) {
  const chartData = gameplays
    .map(gp => ({
      // Firestore Timestamps need to be converted to JS Dates
      date: gp.playedAt.toDate(),
      score: gp.score,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Ensure data is chronological

  const yAxisDomain: [number | 'auto', number | 'auto'] = ['auto', 'auto'];
  if (game.scoring === 'asc') {
      const minScore = Math.min(...chartData.map(d => d.score));
      yAxisDomain[0] = Math.max(0, minScore - 1); // Give a little buffer, but not below 0
  }

  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 10,
                    left: -10,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => format(value, "MMM d")}
                    interval="preserveStartEnd"
                />
                <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    domain={yAxisDomain}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                    }}
                    labelFormatter={(label) => format(label, "PPP")}
                />
                <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{
                        r: 4,
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--card))",
                        strokeWidth: 2
                    }}
                    activeDot={{
                        r: 6,
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--card))",
                        strokeWidth: 2
                    }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
