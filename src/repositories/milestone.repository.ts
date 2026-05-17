import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const milestoneRepository = {
  async findById(id: string, include?: Prisma.MilestoneInclude) {
    return prisma.milestone.findUnique({ where: { id }, include })
  },

  async findManyByProject(projectId: string) {
    return prisma.milestone.findMany({ where: { projectId } })
  },

  async create(data: Prisma.MilestoneCreateInput) {
    return prisma.milestone.create({ data })
  },

  async update(id: string, data: Prisma.MilestoneUpdateInput) {
    return prisma.milestone.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.milestone.delete({ where: { id } })
  },
}
