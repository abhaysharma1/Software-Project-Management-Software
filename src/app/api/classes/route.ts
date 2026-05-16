import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const classSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  section: z.string().max(10).optional(),
  semester: z.string(),
  year: z.number().int().min(2020).max(2030),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = classSchema.parse(body)

    const existing = await prisma.class.findUnique({ where: { code: data.code } })
    if (existing) {
      return NextResponse.json({ error: "Class code already exists" }, { status: 400 })
    }

    const cls = await prisma.class.create({
      data: {
        ...data,
        creatorId: session.user.id,
        teacherId: session.user.id,
      },
    })

    return NextResponse.json(cls, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const classes = await prisma.class.findMany({
    where: session.user.role === "ADMIN" ? undefined : { teacherId: session.user.id },
    include: { _count: { select: { members: true, projects: true, groups: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(classes)
}
