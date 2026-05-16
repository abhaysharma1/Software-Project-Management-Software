import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createMilestoneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  order: z.number().int().min(1),
  weight: z.number().int().min(1).max(10).default(1),
  dueDate: z.string().datetime().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createMilestoneSchema.parse(body)

    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { class: true },
    })
    if (!project || project.class.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const milestone = await prisma.milestone.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        order: data.order,
        weight: data.weight,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    })

    return NextResponse.json(milestone, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
