import { projectRepository } from "@/repositories/project.repository"
import { commentRepository } from "@/repositories/comment.repository"
import { notificationRepository } from "@/repositories/notification.repository"
import { activityLogRepository } from "@/repositories/activity-log.repository"
import type { CommentInput } from "@/validators/comment"

export const commentService = {
  async addComment(input: CommentInput, userId: string, userRole: string, userName: string) {
    const project = await projectRepository.findById(input.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    const comment = await commentRepository.create({
      content: input.content,
      projectId: input.projectId,
      userId,
      parentId: input.parentId || null,
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    if (project.ownerId !== userId) {
      const link = `/${userRole === "TEACHER" || userRole === "ADMIN" ? "teacher" : "student"}/projects/${project.id}`
      await notificationRepository.create({
        type: "COMMENT_ADDED",
        title: "New Comment",
        message: `${userName} commented on ${project.title}`,
        recipientId: project.ownerId,
        senderId: userId,
        link,
      })
    }

    await activityLogRepository.create({
      type: "COMMENT_ADDED",
      description: "commented on the project",
      projectId: input.projectId,
      userId,
    })

    return comment
  },

  async getComments(projectId: string) {
    return commentRepository.findManyByProject(projectId)
  },
}
