import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const unreadOnly = url.searchParams.get("unreadOnly") === "true"
  const countOnly = url.searchParams.get("count") === "true"

  const where = {
    recipientId: session.user.id,
    ...(unreadOnly ? { isRead: false } : {}),
  } as const

  if (countOnly) {
    const count = await prisma.notification.count({ where })
    return NextResponse.json({ count })
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json(notifications)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const all = body.all === true

  if (all) {
    await prisma.notification.updateMany({
      where: { recipientId: session.user.id, isRead: false },
      data: { isRead: true },
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Specify notifications to mark" }, { status: 400 })
}
