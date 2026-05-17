"use server"

import { auth } from "@/lib/auth"
import { projectSchema } from "@/validators/project"
import { projectService } from "@/services/project.service"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    classId: formData.get("classId") as string,
    techStack: JSON.parse((formData.get("techStack") as string) || "[]"),
    repoUrl: formData.get("repoUrl") as string,
    liveUrl: formData.get("liveUrl") as string,
  }

  const data = projectSchema.parse(raw)
  const project = await projectService.createProject(data, session.user.id)
  revalidatePath("/projects")
  return { success: true, project }
}
