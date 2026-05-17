import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { submitSchema, gradeSchema } from "@/validators/submission"
import { submissionService } from "@/services/submission.service"
import { ZodError } from "zod"
import { handleApiError } from "@/lib/app-error"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = submitSchema.parse(body)
    const submission = await submissionService.submitMilestone(data, session.user.id, session.user.name || "", session.user.role)
    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = gradeSchema.parse(body)
    const submission = await submissionService.gradeSubmission(data, session.user.id, session.user.role)
    return NextResponse.json(submission)
  } catch (error) {
    return handleApiError(error)
  }
}
