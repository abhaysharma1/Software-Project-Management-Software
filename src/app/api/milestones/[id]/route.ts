import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { updateMilestoneSchema } from "@/validators/milestone"
import { milestoneService } from "@/services/milestone.service"
import { ZodError } from "zod"
import { handleApiError } from "@/lib/app-error"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateMilestoneSchema.parse(body)
    const updated = await milestoneService.updateMilestone(id, data, session.user.id, session.user.role)
    return NextResponse.json(updated)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const result = await milestoneService.deleteMilestone(id, session.user.id, session.user.role)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
