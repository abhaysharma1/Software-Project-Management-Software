import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  role: z.enum(["STUDENT", "TEACHER"]),
  studentId: z.string().trim().optional(),
  department: z.string().trim().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
  studentId: z.string().trim().optional(),
  department: z.string().trim().optional(),
})

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().transform(v => v.toLowerCase().trim()).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  studentId: z.string().trim().optional(),
  department: z.string().trim().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
