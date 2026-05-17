import { z } from "zod"

export const classSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  section: z.string().max(10).optional(),
  semester: z.string(),
  year: z.number().int().min(2020).max(2030),
})

export type ClassInput = z.infer<typeof classSchema>
