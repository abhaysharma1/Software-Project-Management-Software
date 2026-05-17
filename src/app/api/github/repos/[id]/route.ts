import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { githubService } from "@/services/github.service"
import { handleApiError } from "@/lib/app-error"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    await githubService.unlinkRepository(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
