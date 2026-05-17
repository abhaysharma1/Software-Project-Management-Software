import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const fileRepository = {
  async create(data: Prisma.FileAttachmentCreateInput) {
    return prisma.fileAttachment.create({ data })
  },
}
