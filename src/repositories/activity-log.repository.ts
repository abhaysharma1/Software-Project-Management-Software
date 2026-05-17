import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const activityLogRepository = {
  async create(data: Prisma.ActivityLogCreateInput) {
    return prisma.activityLog.create({ data })
  },
}
