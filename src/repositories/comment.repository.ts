import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const commentRepository = {
  async findManyByProject(projectId: string) {
    return prisma.comment.findMany({
      where: { projectId, parentId: null },
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  },

  async create(data: Prisma.CommentCreateInput & { include?: Prisma.CommentInclude }) {
    const { include, ...createData } = data
    return prisma.comment.create({
      data: createData,
      include: include || { user: { select: { id: true, name: true, image: true } } },
    })
  },
}
