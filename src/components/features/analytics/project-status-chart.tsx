"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

const COLORS: Record<string, string> = {
  PLANNED: "hsl(var(--muted-foreground))",
  IN_PROGRESS: "hsl(var(--primary))",
  REVIEW: "hsl(38, 92%, 50%)",
  COMPLETED: "hsl(142, 76%, 36%)",
  ARCHIVED: "hsl(215, 16%, 47%)",
}

interface ProjectStatusChartProps {
  data: { status: string; count: number }[]
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const chartData = data.map((d) => ({
    name: d.status.replace(/_/g, " "),
    value: d.count,
    color: COLORS[d.status] || "hsl(var(--muted))",
  }))

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
