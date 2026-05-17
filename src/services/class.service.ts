import { classRepository } from "@/repositories/class.repository"
import type { ClassInput } from "@/validators/class"

export const classService = {
  async createClass(input: ClassInput, userId: string) {
    const existing = await classRepository.findByCode(input.code)
    if (existing) {
      throw new Error("Class code already exists")
    }

    return classRepository.create({
      ...input,
      creatorId: userId,
      teacherId: userId,
    })
  },

  async getClasses(role: string, userId: string) {
    const where = role === "ADMIN" ? undefined : { teacherId: userId }
    return classRepository.findMany(where)
  },
}
