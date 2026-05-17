import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const classRepository = {
  async findMany(where?: Prisma.ClassWhereInput) {
    return prisma.class.findMany({
      where,
      include: { _count: { select: { members: true, projects: true, groups: true } } },
      orderBy: { createdAt: "desc" },
    })
  },

  async findByCode(code: string) {
    return prisma.class.findUnique({ where: { code } })
  },

  async findById(id: string) {
    return prisma.class.findUnique({ where: { id } })
  },

  async findFirst(where: Prisma.ClassWhereInput) {
    return prisma.class.findFirst({ where })
  },

  async create(data: Prisma.ClassCreateInput) {
    return prisma.class.create({ data })
  },
}
