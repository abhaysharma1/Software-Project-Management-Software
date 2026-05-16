import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminDashboardContent } from "@/components/features/dashboard/admin-dashboard-content"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const [userCounts, classCount, projectCount, groupCount, recentUsers, recentLogs] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.class.count({ where: { isActive: true } }),
    prisma.project.count({ where: { isArchived: false } }),
    prisma.group.count({ where: { isActive: true } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ])

  const studentCount = userCounts.find((u) => u.role === "STUDENT")?._count ?? 0
  const teacherCount = userCounts.find((u) => u.role === "TEACHER")?._count ?? 0
  const adminCount = userCounts.find((u) => u.role === "ADMIN")?._count ?? 0

  return (
    <AdminDashboardContent
      studentCount={studentCount}
      teacherCount={teacherCount}
      adminCount={adminCount}
      classCount={classCount}
      projectCount={projectCount}
      groupCount={groupCount}
      recentUsers={recentUsers}
      recentLogs={recentLogs}
    />
  )
}
