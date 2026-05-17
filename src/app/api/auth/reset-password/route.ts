import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = schema.parse(body)

    const stored = await prisma.verificationToken.findUnique({ where: { token } })
    if (!stored) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    if (stored.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: stored.identifier },
      data: { passwordHash },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
