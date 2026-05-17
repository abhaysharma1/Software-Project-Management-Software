import { z } from "zod"

export const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  projectId: z.string().uuid(),
  parentId: z.string().uuid().optional().nullable(),
})

export type CommentInput = z.infer<typeof commentSchema>
