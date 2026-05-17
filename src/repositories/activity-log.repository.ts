import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const activityLogRepository = {
  async create(data: Prisma.ActivityLogCreateInput | Prisma.ActivityLogUncheckedCreateInput) {
    return prisma.activityLog.create({ data: data as Prisma.ActivityLogCreateInput })
  },
}
