import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TeacherProjectDetail } from "@/components/features/projects/teacher-project-detail"

export default async function TeacherProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) redirect("/login")

  const { id } = await props.params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, image: true, email: true } },
      class: { select: { id: true, name: true, code: true, teacherId: true } },
      group: {
        include: {
          members: { include: { user: { select: { id: true, name: true, image: true } } } },
        },
      },
      milestones: {
        orderBy: { order: "asc" },
        include: {
          submissions: {
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      comments: {
        where: { parentId: null },
        include: {
          user: { select: { id: true, name: true, image: true } },
          replies: {
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      repositories: true,
      activities: { orderBy: { createdAt: "desc" }, take: 20, include: { user: { select: { name: true, image: true } } } },
    },
  })

  if (!project || (session.user.role !== "ADMIN" && project.class.teacherId !== session.user.id)) {
    notFound()
  }

  return <TeacherProjectDetail project={project} userId={session.user.id} />
}
