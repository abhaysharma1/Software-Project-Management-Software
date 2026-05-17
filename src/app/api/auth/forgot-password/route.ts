import { NextResponse } from "next/server"
import { forgotPasswordSchema } from "@/validators/auth"
import { authService } from "@/services/auth.service"
import { ZodError } from "zod"
import { rateLimit } from "@/lib/rate-limit"
import { handleApiError } from "@/lib/app-error"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  if (!rateLimit(`forgot-password:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = forgotPasswordSchema.parse(body)
    const result = await authService.initiatePasswordReset(data)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
