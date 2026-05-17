import { projectRepository } from "@/repositories/project.repository"
import { fileRepository } from "@/repositories/file.repository"
import type { FileInput } from "@/validators/file"

export const fileService = {
  async attachFile(input: FileInput, userId: string, userRole: string) {
    const project = await projectRepository.findById(input.projectId)
    if (!project) {
      throw new Error("Project not found")
    }
    if (project.ownerId !== userId && userRole === "STUDENT") {
      throw new Error("Not your project")
    }

    return fileRepository.create({
      projectId: input.projectId,
      uploaderId: userId,
      fileName: input.fileName,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      url: input.url,
      key: input.key,
    })
  },
}
