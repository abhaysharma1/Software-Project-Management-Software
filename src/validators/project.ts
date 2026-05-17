import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  classId: z.string().uuid(),
  techStack: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
})

export type ProjectInput = z.infer<typeof projectSchema>
