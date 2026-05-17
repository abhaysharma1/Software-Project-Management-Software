import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectStatusChart } from "@/components/features/analytics/project-status-chart"
import { EnrollmentChart } from "@/components/features/analytics/enrollment-chart"
import { BarChart3, Users, BookOpen, FolderKanban, CheckCircle2 } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/login")

  const [totalUsers, totalClasses, totalProjects, activeGroups, completedProjects] = await Promise.all([
    prisma.user.count(),
    prisma.class.count({ where: { isActive: true } }),
    prisma.project.count({ where: { isArchived: false } }),
    prisma.group.count({ where: { isActive: true } }),
    prisma.project.count({ where: { status: "COMPLETED", isArchived: false } }),
  ])

  const userByRole = await prisma.user.groupBy({ by: ["role"], _count: true })
  const projectStatuses = await prisma.project.groupBy({ by: ["status"], _count: true })
  const classesBySemester = await prisma.class.groupBy({ by: ["semester"], _count: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Platform statistics and insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Users
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalUsers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Active Classes
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalClasses}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FolderKanban className="h-4 w-4" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalProjects}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{completedProjects}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Active Groups
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeGroups}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Users by Role</CardTitle></CardHeader>
          <CardContent>
            <EnrollmentChart
              data={userByRole.map((r) => ({ label: r.role, value: r._count }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Project Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ProjectStatusChart
              data={projectStatuses.map((s) => ({ status: s.status, count: s._count }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
