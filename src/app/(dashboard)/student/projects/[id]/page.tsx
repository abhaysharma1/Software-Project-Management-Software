import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StudentProjectDetail } from "@/components/features/projects/student-project-detail"

export default async function StudentProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !["STUDENT", "TEACHER", "ADMIN"].includes(session.user.role)) redirect("/login")

  const { id } = await props.params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      class: { select: { name: true, code: true } },
      group: { include: { members: { include: { user: { select: { id: true, name: true, image: true } } } } } },
      milestones: {
        orderBy: { order: "asc" },
        include: {
          submissions: {
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      comments: {
        where: { parentId: null },
        include: {
          user: { select: { id: true, name: true, image: true } },
          replies: { include: { user: { select: { id: true, name: true, image: true } } }, orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      },
      repositories: true,
    },
  })

  if (!project || (session.user.role === "STUDENT" && project.ownerId !== session.user.id)) {
    notFound()
  }

  return <StudentProjectDetail project={project} userId={session.user.id} />
}
