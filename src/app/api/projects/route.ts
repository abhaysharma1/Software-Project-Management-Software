import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  classId: z.string().uuid(),
  techStack: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = projectSchema.parse(body)

    const classExists = await prisma.class.findUnique({ where: { id: data.classId } })
    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId,
        techStack: JSON.stringify(data.techStack),
        ownerId: session.user.id,
        tags: "[]",
      },
    })

    await prisma.activityLog.create({
      data: {
        type: "PROJECT_CREATED",
        description: "created a new project",
        projectId: project.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: session.user.role === "STUDENT"
      ? { ownerId: session.user.id }
      : undefined,
    include: {
      owner: { select: { name: true, image: true } },
      class: { select: { name: true, code: true } },
      _count: { select: { milestones: true, comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(projects)
}
