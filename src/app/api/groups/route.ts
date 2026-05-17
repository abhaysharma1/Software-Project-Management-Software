import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { groupSchema, paginationSchema } from "@/validators"
import { groupService } from "@/services/group.service"
import { ZodError } from "zod"
import { handleApiError } from "@/lib/app-error"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = groupSchema.parse(body)
    const group = await groupService.createGroup(data, session.user.id)
    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const url = new URL(req.url)
    const pagination = paginationSchema.parse(Object.fromEntries(url.searchParams))

    const result = await groupService.getGroups(session.user.role, session.user.id, pagination)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
