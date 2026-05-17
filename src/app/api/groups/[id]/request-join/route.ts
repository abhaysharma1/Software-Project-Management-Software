import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { groupService } from "@/services/group.service"
import { handleApiError } from "@/lib/app-error"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const result = await groupService.requestJoinGroup(id, session.user.id)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
