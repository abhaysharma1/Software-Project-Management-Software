import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TeacherDashboardContent } from "@/components/features/dashboard/teacher-dashboard-content"

export default async function TeacherDashboardPage() {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login")
  }

  const [
    classes,
    projectsCount,
    pendingReviews,
    activeGroups,
    upcomingDeadlines,
    recentActivity,
  ] = await Promise.all([
    prisma.class.findMany({
      where: { teacherId: session.user.id, isActive: true },
      select: { id: true, name: true, code: true, _count: { select: { members: true, projects: true } } },
    }),
    prisma.project.count({ where: { class: { teacherId: session.user.id }, isArchived: false } }),
    prisma.milestoneSubmission.count({
      where: { grade: null, milestone: { project: { class: { teacherId: session.user.id } } } },
    }),
    prisma.group.count({ where: { class: { teacherId: session.user.id }, isActive: true } }),
    prisma.milestone.findMany({
      where: {
        dueDate: { gte: new Date() },
        status: { not: "APPROVED" },
        project: { class: { teacherId: session.user.id } },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { project: { select: { title: true } } },
    }),
    prisma.activityLog.findMany({
      where: { project: { class: { teacherId: session.user.id } } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, image: true } }, project: { select: { title: true } } },
    }),
  ])

  const completedProjects = await prisma.project.count({
    where: { class: { teacherId: session.user.id }, status: "COMPLETED", isArchived: false },
  })
  const completionPct = projectsCount > 0 ? Math.round((completedProjects / projectsCount) * 100) : 0

  return (
    <TeacherDashboardContent
      classes={classes}
      projectsCount={projectsCount}
      pendingReviews={pendingReviews}
      activeGroups={activeGroups}
      completionPct={completionPct}
      upcomingDeadlines={upcomingDeadlines}
      recentActivity={recentActivity}
    />
  )
}
