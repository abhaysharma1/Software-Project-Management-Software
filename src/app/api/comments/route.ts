import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  projectId: z.string().uuid(),
  parentId: z.string().uuid().optional().nullable(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = commentSchema.parse(body)

    const project = await prisma.project.findUnique({ where: { id: data.projectId } })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        projectId: data.projectId,
        userId: session.user.id,
        parentId: data.parentId || null,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    // Create notification for project owner (if not self-comment)
    if (project.ownerId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "COMMENT_ADDED",
          title: "New Comment",
          message: `${session.user.name} commented on ${project.title}`,
          recipientId: project.ownerId,
          senderId: session.user.id,
          link: `/${session.user.role === "TEACHER" || session.user.role === "ADMIN" ? "teacher" : "student"}/projects/${project.id}`,
        },
      })
    }

    await prisma.activityLog.create({
      data: {
        type: "COMMENT_ADDED",
        description: "commented on the project",
        projectId: data.projectId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const projectId = url.searchParams.get("projectId")

  if (!projectId) {
    return NextResponse.json({ error: "projectId query param required" }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { projectId, parentId: null },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(comments)
}
