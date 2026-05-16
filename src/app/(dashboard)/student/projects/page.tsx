import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StudentProjectsContent } from "@/components/features/projects/student-projects-content"

export default async function StudentProjectsPage() {
  const session = await auth()
  if (!session || !["STUDENT", "TEACHER", "ADMIN"].includes(session.user.role)) {
    redirect("/login")
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id, isArchived: false },
    include: {
      class: { select: { name: true, code: true } },
      group: { select: { name: true } },
      milestones: { orderBy: { order: "asc" } },
      _count: { select: { comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const classes = await prisma.classMembership.findMany({
    where: { userId: session.user.id },
    include: { class: { select: { id: true, name: true, code: true } } },
  })

  return (
    <StudentProjectsContent
      projects={projects}
      classes={classes.map((c) => c.class)}
      userId={session.user.id}
    />
  )
}
