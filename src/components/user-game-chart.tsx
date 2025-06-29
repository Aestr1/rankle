
"use client";

import * as React from "react"
import { format } from "date-fns"
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer } from "recharts"

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
    }));

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
                    domain={[0, 100]}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                    }}
                    labelFormatter={(label) => format(label, "PPP")}
                    formatter={(value: number) => [`${value} / 100`, "Score"]}
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
