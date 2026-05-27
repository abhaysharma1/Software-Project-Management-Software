"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BarChart3, Users, GraduationCap, Kanban } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const DASHBOARD_TABS = [
  {
    id: "teacher",
    label: "Teacher Dashboard",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "student",
    label: "Student Dashboard",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "board",
    label: "Project Board",
    icon: Kanban,
    color: "from-amber-500 to-orange-600",
  },
] as const

type DashboardId = (typeof DASHBOARD_TABS)[number]["id"]

export function DashboardShowcaseSection() {
  const [activeTab, setActiveTab] = useState<DashboardId>("teacher")
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="dashboard-showcase"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="dashboard-label mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Powerful dashboards
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            See your{" "}
            <span className="text-primary">
              entire workflow
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Role-based dashboards designed for teachers, students, and administrators.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardId)}>
          <div className="mb-8 flex justify-center">
            <TabsList className="bg-white/5">
              {DASHBOARD_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-white/10"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {DASHBOARD_TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <DashboardContent tabId={tab.id} />
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}

function DashboardContent({ tabId }: { tabId: DashboardId }) {
  switch (tabId) {
    case "teacher":
      return <TeacherDashboardMock />
    case "student":
      return <StudentDashboardMock />
    case "analytics":
      return <AnalyticsDashboardMock />
    case "board":
      return <ProjectBoardMock />
  }
}

function TeacherDashboardMock() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">Teacher Dashboard — Spring 2026</span>
      </div>
      <div className="p-6">
        <div className="mb-6 grid grid-cols-4 gap-4">
          {[
            { label: "Active Classes", value: "4", color: "bg-primary/20 text-primary" },
            { label: "Total Students", value: "186", color: "bg-muted text-muted-foreground" },
            { label: "Active Projects", value: "47", color: "bg-primary/10 text-primary" },
            { label: "Pending Reviews", value: "12", color: "bg-muted text-muted-foreground" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="mb-1 text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-medium">Recent Activity</p>
            <div className="space-y-3">
              {[
                "Team Aurora pushed 23 commits",
                "CS 401 milestone review due",
                "Group 5 opened pull request",
                "Sprint retrospective scheduled",
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {activity}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-medium">Class Performance</p>
            <div className="flex items-end gap-2" style={{ height: 100 }}>
              {[65, 80, 45, 90, 70, 85, 60].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-primary/30"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentDashboardMock() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">Student Dashboard — Team Aurora</span>
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            TA
          </div>
          <div>
            <p className="font-medium">Team Aurora</p>
            <p className="text-xs text-muted-foreground">CS 401 — Software Engineering</p>
          </div>
          <div className="ml-auto rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            On Track
          </div>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-4">
          {[
            { label: "Commits This Week", value: "47", sub: "+12% vs last week" },
            { label: "Open PRs", value: "3", sub: "2 awaiting review" },
            { label: "Milestone Progress", value: "72%", sub: "Sprint 3 of 5" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-sm font-medium">Recent Commits</p>
          <div className="space-y-2">
            {[
              { msg: "feat: implement auth flow", time: "2h ago", branch: "main" },
              { msg: "fix: resolve type errors", time: "4h ago", branch: "dev" },
              { msg: "refactor: extract api client", time: "6h ago", branch: "main" },
            ].map((commit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-mono text-muted-foreground">{commit.msg}</span>
                <span className="ml-auto text-muted-foreground">{commit.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsDashboardMock() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">Analytics — Team Overview</span>
      </div>
      <div className="p-6">
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: "Team Velocity", value: "124 pts/sprint" },
            { label: "Code Coverage", value: "87%" },
            { label: "Avg Review Time", value: "4.2h" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-medium">Contribution by Team Member</p>
            <div className="space-y-3">
              {[
                { name: "Alex", commits: 87, color: "bg-primary" },
                { name: "Sarah", commits: 65, color: "bg-primary/60" },
                { name: "Mike", commits: 52, color: "bg-muted-foreground" },
                { name: "Lisa", commits: 48, color: "bg-muted-foreground/60" },
              ].map((member) => (
                <div key={member.name} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-muted-foreground">{member.name}</span>
                  <div className="flex-1 rounded-full bg-white/5">
                    <div
                      className={`h-2 rounded-full ${member.color}`}
                      style={{ width: `${(member.commits / 87) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{member.commits}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-sm font-medium">Sprint Burndown</p>
            <div className="flex items-end gap-1" style={{ height: 80 }}>
              {[40, 35, 28, 22, 15, 8, 3].map((points, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-primary/30"
                    style={{ height: `${(points / 40) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">D{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectBoardMock() {
  const columns = [
    {
      title: "To Do",
      color: "bg-muted-foreground/20",
      items: ["Set up CI/CD", "Write API docs", "Design system"],
    },
    {
      title: "In Progress",
      color: "bg-primary/20",
      items: ["Implement auth", "User dashboard"],
    },
    {
      title: "Review",
      color: "bg-muted-foreground/20",
      items: ["PR #42: Fix routing"],
    },
    {
      title: "Done",
      color: "bg-primary/20",
      items: ["Project setup", "Database schema", "API scaffold"],
    },
  ]

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground">Project Board — CS 401</span>
      </div>
      <div className="grid grid-cols-4 gap-3 p-4">
        {columns.map((col) => (
          <div
            key={col.title}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium">{col.title}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${col.color} text-muted-foreground`}
              >
                {col.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {col.items.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-xs text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
