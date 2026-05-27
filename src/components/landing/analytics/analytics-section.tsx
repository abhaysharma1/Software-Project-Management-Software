"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
} from "recharts"
import { AnimatedCounter } from "@/components/animation/animated-counter"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { staggerContainer, staggerItem } from "@/lib/animation"

const weeklyData = [
  { name: "Mon", commits: 45, prs: 12, reviews: 8 },
  { name: "Tue", commits: 62, prs: 18, reviews: 14 },
  { name: "Wed", commits: 38, prs: 8, reviews: 6 },
  { name: "Thu", commits: 71, prs: 22, reviews: 16 },
  { name: "Fri", commits: 55, prs: 15, reviews: 11 },
  { name: "Sat", commits: 28, prs: 5, reviews: 3 },
  { name: "Sun", commits: 15, prs: 3, reviews: 2 },
]

const monthlyData = [
  { name: "W1", submissions: 12, completed: 8, avgScore: 78 },
  { name: "W2", submissions: 18, completed: 14, avgScore: 82 },
  { name: "W3", submissions: 24, completed: 20, avgScore: 85 },
  { name: "W4", submissions: 30, completed: 26, avgScore: 88 },
  { name: "W5", submissions: 35, completed: 31, avgScore: 86 },
  { name: "W6", submissions: 42, completed: 38, avgScore: 90 },
]

export function AnalyticsSection() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="analytics" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Data-driven insights
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything{" "}
            <span className="text-primary">
              measured
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive analytics for teams, projects, and individual contributions.
          </p>
        </motion.div>

        <motion.div
          variants={!reducedMotion ? staggerContainer : undefined}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { label: "Active Users", value: 12000, suffix: "+", prefix: "" },
            { label: "Projects Tracked", value: 50000, suffix: "+", prefix: "" },
            { label: "Institutions", value: 500, suffix: "+", prefix: "" },
            { label: "Avg Completion", value: 94, suffix: "%", prefix: "" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={!reducedMotion ? staggerItem : undefined}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-4 text-center backdrop-blur-sm"
            >
              <p className="mb-1 text-2xl font-bold text-primary sm:text-3xl">
                <AnimatedCounter
                  from={0}
                  to={stat.value}
                  duration={2.5}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={!reducedMotion ? staggerContainer : undefined}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.div variants={!reducedMotion ? staggerItem : undefined} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
            <p className="mb-4 text-sm font-medium">Weekly Activity</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="commits" fill="hsl(var(--primary) / 0.6)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="prs" fill="hsl(var(--primary) / 0.35)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" fill="hsl(var(--primary) / 0.2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={!reducedMotion ? staggerItem : undefined} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
            <p className="mb-4 text-sm font-medium">Sprint Progression</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <defs>
                    <linearGradient id="submissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary) / 0.4)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary) / 0.4)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary) / 0.25)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary) / 0.25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="submissions" stroke="hsl(var(--primary) / 0.8)" fill="url(#submissions)" strokeWidth={2} />
                  <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary) / 0.5)" fill="url(#completed)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={!reducedMotion ? staggerItem : undefined} className="col-span-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
            <p className="mb-4 text-sm font-medium">Score Trends</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--primary) / 0.8)" strokeWidth={2} dot={{ fill: "hsl(var(--primary) / 1)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
