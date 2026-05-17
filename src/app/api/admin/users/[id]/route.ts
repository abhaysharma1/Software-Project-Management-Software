import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  studentId: z.string().optional(),
  department: z.string().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const updateData: Record<string, unknown> = { ...data }
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12)
    }
    delete updateData.password

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (session.user.id === id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
  }

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
