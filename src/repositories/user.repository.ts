import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findMany(params: { search?: string; role?: string }) {
    const where: Prisma.UserWhereInput = {}
    if (params.role) where.role = params.role
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
      ]
    }
    return prisma.user.findMany({ where, orderBy: { createdAt: "desc" } })
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  },

  async count(params?: { role?: string }) {
    const where: Prisma.UserWhereInput = {}
    if (params?.role) where.role = params.role
    return prisma.user.count({ where })
  },
}
