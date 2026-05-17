import { z } from "zod"

export const fileSchema = z.object({
  projectId: z.string().uuid(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1),
  url: z.string().url(),
  key: z.string().min(1),
})

export type FileInput = z.infer<typeof fileSchema>
