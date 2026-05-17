import { z } from "zod"

export const submitSchema = z.object({
  milestoneId: z.string().uuid(),
  content: z.string().min(10).max(10000),
  notes: z.string().max(2000).optional(),
})

export const gradeSchema = z.object({
  submissionId: z.string().uuid(),
  grade: z.number().int().min(0).max(100),
  feedback: z.string().max(5000).optional(),
})

export type SubmitInput = z.infer<typeof submitSchema>
export type GradeInput = z.infer<typeof gradeSchema>
