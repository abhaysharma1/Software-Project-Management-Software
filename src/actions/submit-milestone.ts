"use server"

import { auth } from "@/lib/auth"
import { submitSchema } from "@/validators/submission"
import { submissionService } from "@/services/submission.service"
import { revalidatePath } from "next/cache"

export async function submitMilestone(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const raw = {
    milestoneId: formData.get("milestoneId") as string,
    content: formData.get("content") as string,
    notes: formData.get("notes") as string || undefined,
  }

  const data = submitSchema.parse(raw)
  const submission = await submissionService.submitMilestone(
    data,
    session.user.id,
    session.user.name || "",
    session.user.role
  )
  revalidatePath(`/projects/${submission.milestoneId}`)
  revalidatePath("/projects")
  return { success: true, submission }
}
