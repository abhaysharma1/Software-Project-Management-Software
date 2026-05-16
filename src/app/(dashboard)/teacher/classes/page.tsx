import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClassesPageContent } from "@/components/features/classes/classes-page-content"

export default async function TeacherClassesPage() {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login")
  }

  const classes = await prisma.class.findMany({
    where: { teacherId: session.user.id },
    include: {
      _count: { select: { members: true, projects: true, groups: true } },
      teacher: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return <ClassesPageContent classes={classes} teacherId={session.user.id} />
}
