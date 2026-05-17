import { NextResponse } from "next/server"
import { forgotPasswordSchema } from "@/validators/auth"
import { authService } from "@/services/auth.service"
import { ZodError } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = forgotPasswordSchema.parse(body)
    const result = await authService.initiatePasswordReset(data)
    return NextResponse.json(result)
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
