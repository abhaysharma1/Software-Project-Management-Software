import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { updateUserSchema } from "@/validators/user"
import { userService } from "@/services/user.service"
import { ZodError } from "zod"
import { handleApiError } from "@/lib/app-error"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateUserSchema.parse(body)
    const user = await userService.updateUser(id, data)
    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const result = await userService.deleteUser(id, session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
