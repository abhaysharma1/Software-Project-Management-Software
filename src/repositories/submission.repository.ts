import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const submissionRepository = {
  async findById(id: string, include?: Prisma.MilestoneSubmissionInclude) {
    return prisma.milestoneSubmission.findUnique({ where: { id }, include })
  },

  async findByMilestoneAndUser(milestoneId: string, userId: string) {
    return prisma.milestoneSubmission.findFirst({
      where: { milestoneId, userId },
    })
  },

  async create(data: Prisma.MilestoneSubmissionCreateInput) {
    return prisma.milestoneSubmission.create({ data })
  },

  async update(id: string, data: Prisma.MilestoneSubmissionUpdateInput) {
    return prisma.milestoneSubmission.update({ where: { id }, data })
  },
}
