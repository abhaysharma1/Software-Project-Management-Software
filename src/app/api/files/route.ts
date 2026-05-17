import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { fileSchema } from "@/validators/file"
import { fileService } from "@/services/file.service"
import { ZodError } from "zod"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = fileSchema.parse(body)
    const file = await fileService.attachFile(data, session.user.id, session.user.role)
    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
