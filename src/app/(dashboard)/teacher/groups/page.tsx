import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { GroupsPageContent } from "@/components/features/groups/groups-page-content"

export default async function TeacherGroupsPage() {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login")
  }

  const [groups, classes] = await Promise.all([
    prisma.group.findMany({
      where: { class: { teacherId: session.user.id } },
      include: {
        class: { select: { name: true, code: true } },
        members: {
          include: { user: { select: { id: true, name: true, image: true, email: true } } },
        },
        project: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.class.findMany({
      where: { teacherId: session.user.id, isActive: true },
      select: { id: true, name: true, code: true },
    }),
  ])

  return <GroupsPageContent groups={groups} classes={classes} teacherId={session.user.id} />
}
