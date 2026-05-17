import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import type { RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "@/validators"
import { userRepository } from "@/repositories/user.repository"

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) {
      throw new Error("Email already registered")
    }

    const passwordHash = await bcrypt.hash(input.password, 12)

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      studentId: input.studentId,
      department: input.department,
    })

    return { success: true, userId: user.id }
  },

  async initiatePasswordReset(input: ForgotPasswordInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user) {
      throw new Error("No account found with that email")
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: { identifier: input.email, token, expires },
    })

    await sendPasswordResetEmail(input.email, token)

    return { success: true }
  },

  async resetPassword(input: ResetPasswordInput) {
    const stored = await prisma.verificationToken.findUnique({ where: { token: input.token } })
    if (!stored) {
      throw new Error("Invalid or expired token")
    }

    if (stored.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token: input.token } })
      throw new Error("Token has expired")
    }

    const passwordHash = await bcrypt.hash(input.password, 12)

    await prisma.user.update({
      where: { email: stored.identifier },
      data: { passwordHash },
    })

    await prisma.verificationToken.delete({ where: { token: input.token } })

    return { success: true }
  },
}
