import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const projectRepository = {
  async findMany(where?: Prisma.ProjectWhereInput) {
    return prisma.project.findMany({
      where,
      include: {
        owner: { select: { name: true, image: true } },
        class: { select: { name: true, code: true } },
        _count: { select: { milestones: true, comments: true } },
      },
      orderBy: { updatedAt: "desc" },
    })
  },

  async findById(id: string, include?: Prisma.ProjectInclude) {
    return prisma.project.findUnique({ where: { id }, include })
  },

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data })
  },

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data })
  },
}
