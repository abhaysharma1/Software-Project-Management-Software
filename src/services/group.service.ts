import { classRepository } from "@/repositories/class.repository"
import { groupRepository } from "@/repositories/group.repository"
import type { GroupInput } from "@/validators/group"

export const groupService = {
  async createGroup(input: GroupInput, userId: string) {
    const classExists = await classRepository.findFirst({ id: input.classId, teacherId: userId })
    if (!classExists) {
      throw new Error("Class not found")
    }

    return groupRepository.create({
      name: input.name,
      classId: input.classId,
      maxSize: input.maxSize,
      creatorId: userId,
    })
  },

  async getGroups(role: string, userId: string) {
    const where = role === "STUDENT"
      ? { members: { some: { userId } } }
      : undefined
    return groupRepository.findMany(where)
  },
}
