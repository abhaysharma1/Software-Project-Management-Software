"use server"

import { auth } from "@/lib/auth"
import { createMilestoneSchema } from "@/validators/milestone"
import { milestoneService } from "@/services/milestone.service"
import { revalidatePath } from "next/cache"

export async function createMilestone(formData: FormData) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized")
  }

  const raw = {
    projectId: formData.get("projectId") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    order: parseInt(formData.get("order") as string) || 1,
    weight: parseInt(formData.get("weight") as string) || 1,
    dueDate: formData.get("dueDate") as string || undefined,
  }

  const data = createMilestoneSchema.parse(raw)
  const milestone = await milestoneService.createMilestone(data, session.user.id)
  revalidatePath(`/projects/${data.projectId}`)
  return { success: true, milestone }
}
