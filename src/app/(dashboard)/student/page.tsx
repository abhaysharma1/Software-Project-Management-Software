import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StudentDashboardContent } from "@/components/features/dashboard/student-dashboard-content"

export default async function StudentDashboardPage() {
  const session = await auth()
  if (!session || !["STUDENT", "TEACHER", "ADMIN"].includes(session.user.role)) {
    redirect("/login")
  }

  const userId = session.user.id

  const [projects, groupMemberships, notifications, upcomingSubmissions] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId, isArchived: false },
      include: {
        milestones: { orderBy: { order: "asc" } },
        group: { include: { members: { include: { user: { select: { name: true, image: true } } } } } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.groupMember.findMany({
      where: { userId },
      include: { group: { include: { project: true, members: { include: { user: { select: { name: true, image: true } } } } } } },
    }),
    prisma.notification.findMany({
      where: { recipientId: userId, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.milestone.findMany({
      where: {
        project: { ownerId: userId },
        dueDate: { gte: new Date() },
        status: { notIn: ["APPROVED", "COMPLETED"] },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { project: { select: { title: true } } },
    }),
  ])

  const totalMilestones = projects.reduce((sum, p) => sum + p.milestones.length, 0)
  const completedMilestones = projects.reduce(
    (sum, p) => sum + p.milestones.filter((m) => m.status === "APPROVED").length,
    0
  )
  const completionPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  const teamMembers = groupMemberships.flatMap((gm) =>
    gm.group.members.filter((m) => m.userId !== userId).map((m) => m.user)
  )

  return (
    <StudentDashboardContent
      projects={projects}
      notifications={notifications}
      upcomingSubmissions={upcomingSubmissions}
      completionPct={completionPct}
      teamMembers={teamMembers}
      groupMemberships={groupMemberships}
    />
  )
}
