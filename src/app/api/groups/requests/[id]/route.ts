import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { approveRequestSchema } from "@/validators/group"
import { groupService } from "@/services/group.service"
import { ZodError } from "zod"
import { handleApiError } from "@/lib/app-error"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { status } = approveRequestSchema.parse(body)

    const result = status === "APPROVED"
      ? await groupService.approveJoinRequest(id, session.user.id)
      : await groupService.rejectJoinRequest(id, session.user.id)

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
