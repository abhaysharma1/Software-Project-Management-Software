import { z } from "zod"

export const createMilestoneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  order: z.number().int().min(1),
  weight: z.number().int().min(1).max(10).default(1),
  dueDate: z.string().datetime().optional(),
})

export const updateMilestoneSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"]).optional(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional().nullable(),
})

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>
