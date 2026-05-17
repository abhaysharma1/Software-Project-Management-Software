import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const fileSchema = z.object({
  projectId: z.string().uuid(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1),
  url: z.string().url(),
  key: z.string().min(1),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = fileSchema.parse(body)

    const project = await prisma.project.findUnique({ where: { id: data.projectId } })
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })
    if (project.ownerId !== session.user.id && session.user.role === "STUDENT") {
      return NextResponse.json({ error: "Not your project" }, { status: 403 })
    }

    const file = await prisma.fileAttachment.create({
      data: {
        projectId: data.projectId,
        uploaderId: session.user.id,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        url: data.url,
        key: data.key,
      },
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
