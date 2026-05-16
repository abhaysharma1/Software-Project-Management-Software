import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"]).optional(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional().nullable(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: { project: { include: { class: true } } },
    })
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    const isTeacher = session.user.role === "TEACHER" || session.user.role === "ADMIN"
    const isOwner = milestone.project.ownerId === session.user.id

    if (!isTeacher && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (data.status && !isTeacher && data.status !== "SUBMITTED") {
      return NextResponse.json({ error: "Only teachers can change status to that value" }, { status: 403 })
    }

    const updateData: Record<string, unknown> = { ...data }
    if (data.status === "APPROVED" || data.status === "REJECTED") {
      updateData.completedAt = new Date()
    }

    const updated = await prisma.milestone.update({
      where: { id },
      data: updateData,
    })

    // Log activity
    if (data.status) {
      await prisma.activityLog.create({
        data: {
          type: data.status === "SUBMITTED" ? "MILESTONE_SUBMITTED" :
                data.status === "APPROVED" ? "MILESTONE_APPROVED" :
                data.status === "REJECTED" ? "MILESTONE_REJECTED" : "PROJECT_UPDATED",
          description: `${data.status === "SUBMITTED" ? "submitted" : data.status === "APPROVED" ? "approved" : data.status === "REJECTED" ? "rejected" : "updated"} milestone "${milestone.title}"`,
          projectId: milestone.projectId,
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await prisma.milestone.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
