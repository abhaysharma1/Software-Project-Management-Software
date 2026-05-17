import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const groupRepository = {
  async findMany(where?: Prisma.GroupWhereInput) {
    return prisma.group.findMany({
      where,
      include: {
        class: { select: { name: true, code: true } },
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
        project: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  },

  async findById(id: string) {
    return prisma.group.findUnique({ where: { id } })
  },

  async create(data: Prisma.GroupCreateInput) {
    return prisma.group.create({ data })
  },
}
