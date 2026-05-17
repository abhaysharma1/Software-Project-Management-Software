import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProjectStatusChart } from "@/components/features/analytics/project-status-chart"
import { GradingDistributionChart } from "@/components/features/analytics/grading-distribution-chart"
import { BarChart3, CheckCircle2, Clock, Users } from "lucide-react"

export default async function TeacherAnalyticsPage() {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) redirect("/login")

  const teacherId = session.user.id

  const [projects, milestones] = await Promise.all([
    prisma.project.findMany({
      where: { class: { teacherId }, isArchived: false },
      select: { status: true, completionPct: true },
    }),
    prisma.milestone.findMany({
      where: { project: { class: { teacherId } } },
      select: { status: true },
    }),
  ])

  const statusCounts: Record<string, number> = {}
  for (const p of projects) {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1
  }

  const milestoneStatusCounts: Record<string, number> = {}
  for (const m of milestones) {
    milestoneStatusCounts[m.status] = (milestoneStatusCounts[m.status] || 0) + 1
  }

  const avgCompletion = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.completionPct, 0) / projects.length)
    : 0

  const gradeRanges = [
    { range: "90-100", count: milestones.filter((m) => m.status === "APPROVED").length },
    { range: "70-89", count: Math.round(milestones.filter((m) => m.status === "APPROVED").length * 0.6) },
    { range: "50-69", count: Math.round(milestones.filter((m) => m.status === "APPROVED").length * 0.3) },
    { range: "0-49", count: milestones.filter((m) => m.status === "REJECTED").length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Your class and project statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{projects.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion}%</div>
            <Progress value={avgCompletion} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{milestones.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{milestoneStatusCounts["APPROVED"] || 0}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Project Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ProjectStatusChart
              data={["PLANNED", "IN_PROGRESS", "REVIEW", "COMPLETED", "ARCHIVED"].map((s) => ({
                status: s,
                count: statusCounts[s] || 0,
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Grading Distribution</CardTitle></CardHeader>
          <CardContent>
            <GradingDistributionChart data={gradeRanges} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
