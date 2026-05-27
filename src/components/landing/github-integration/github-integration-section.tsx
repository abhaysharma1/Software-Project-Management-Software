"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GitBranch, GitPullRequest, GitCommitHorizontal, Star, Code2 } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { staggerContainer, staggerItem } from "@/lib/animation"

const commits = [
  { msg: "feat: implement classroom API endpoints", author: "alex", branch: "main", time: "2m ago" },
  { msg: "fix: resolve race condition in auth middleware", author: "sarah", branch: "dev", time: "5m ago" },
  { msg: "refactor: extract analytics service layer", author: "mike", branch: "analytics", time: "12m ago" },
  { msg: "test: add integration tests for project API", author: "lisa", branch: "main", time: "18m ago" },
  { msg: "docs: update API reference documentation", author: "alex", branch: "docs", time: "25m ago" },
  { msg: "style: format code with prettier config", author: "sarah", branch: "dev", time: "33m ago" },
]

export function GithubIntegrationSection() {
  const reducedMotion = useReducedMotion()
  const [currentCommitIndex, setCurrentCommitIndex] = useState(0)
  const [intensities] = useState(() =>
    Array.from({ length: 28 }, () => Math.random())
  )

  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      setCurrentCommitIndex((prev) => (prev + 1) % commits.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <section id="github" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Deep integration
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-primary">
              GitHub
            </span>{" "}
            at the core
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time commit tracking, PR reviews, and contribution analytics — deeply integrated.
          </p>
        </motion.div>

        <motion.div
          variants={!reducedMotion ? staggerContainer : undefined}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 lg:grid-cols-3"
        >
          <motion.div variants={!reducedMotion ? staggerItem : undefined} className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Live Commit Stream</span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Live
                </span>
              </div>

              <div className="space-y-1">
                {commits.slice(0, 5).map((commit, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                      i === currentCommitIndex
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono">{commit.msg}</span>
                    <span className="ml-auto flex items-center gap-2">
                      <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                        {commit.branch}
                      </span>
                      <span>{commit.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={!reducedMotion ? staggerItem : undefined} className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Repository Stats</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Total Commits", value: "2,847" },
                  { label: "Open PRs", value: "23" },
                  { label: "Stars", value: "142" },
                  { label: "Contributors", value: "48" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2">
                <GitPullRequest className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">PR Overview</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: "feat: add dark mode", status: "open", comments: 3 },
                  { title: "fix: login redirect", status: "review", comments: 5 },
                  { title: "refactor: api client", status: "merged", comments: 0 },
                ].map((pr) => (
                  <div
                    key={pr.title}
                    className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        pr.status === "open"
                          ? "bg-primary"
                          : pr.status === "review"
                            ? "bg-amber-500"
                            : "bg-primary"
                      }`}
                    />
                    <span className="flex-1 truncate text-muted-foreground">{pr.title}</span>
                    {pr.comments > 0 && (
                      <span className="text-[10px] text-muted-foreground">{pr.comments} comments</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={!reducedMotion ? staggerItem : undefined} className="col-span-full">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Contribution Heatmap (Last 4 Weeks)</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = intensities[i]
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: 24,
                        backgroundColor:
                          intensity > 0.7
                            ? "hsl(var(--primary) / 0.6)"
                            : intensity > 0.4
                              ? "hsl(var(--primary) / 0.3)"
                              : intensity > 0.1
                                ? "hsl(var(--primary) / 0.1)"
                                : "rgba(255,255,255,0.03)",
                      }}
                    />
                  )
                })}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>4 weeks ago</span>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  {[0.03, 0.1, 0.3, 0.6].map((o) => (
                    <div
                      key={o}
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: `hsl(var(--primary) / ${o})` }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
