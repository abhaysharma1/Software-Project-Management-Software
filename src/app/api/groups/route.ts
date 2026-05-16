import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const groupSchema = z.object({
  name: z.string().min(2).max(100),
  classId: z.string().uuid(),
  maxSize: z.number().int().min(1).max(20).default(5),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = groupSchema.parse(body)

    const classExists = await prisma.class.findFirst({
      where: { id: data.classId, teacherId: session.user.id },
    })
    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const group = await prisma.group.create({
      data: {
        name: data.name,
        classId: data.classId,
        maxSize: data.maxSize,
        creatorId: session.user.id,
      },
    })

    return NextResponse.json(group, { status: 201 })
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

  const groups = await prisma.group.findMany({
    where: session.user.role === "STUDENT"
      ? { members: { some: { userId: session.user.id } } }
      : undefined,
    include: {
      class: { select: { name: true, code: true } },
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
      project: { select: { id: true, title: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(groups)
}
