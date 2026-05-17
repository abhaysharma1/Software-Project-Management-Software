import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const notificationRepository = {
  async findManyByUser(userId: string, take = 50) {
    return prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take,
    })
  },

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } })
  },

  async create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data })
  },

  async update(id: string, data: Prisma.NotificationUpdateInput) {
    return prisma.notification.update({ where: { id }, data })
  },

  async updateMany(where: Prisma.NotificationWhereInput, data: Prisma.NotificationUpdateManyMutationInput) {
    return prisma.notification.updateMany({ where, data })
  },

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } })
  },

  async count(where?: Prisma.NotificationWhereInput) {
    return prisma.notification.count({ where })
  },
}
