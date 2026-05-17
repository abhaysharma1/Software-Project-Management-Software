import { z } from "zod"

export const groupSchema = z.object({
  name: z.string().min(2).max(100),
  classId: z.string().uuid(),
  maxSize: z.number().int().min(1).max(20).default(5),
})

export type GroupInput = z.infer<typeof groupSchema>
