import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { notificationService } from "@/services/notification.service"
import { handleApiError } from "@/lib/app-error"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const notification = await notificationService.markAsRead(id, session.user.id)
    return NextResponse.json(notification)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const result = await notificationService.deleteNotification(id, session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
