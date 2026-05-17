import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (notification.recipientId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (notification.recipientId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await prisma.notification.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
