import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "4MB", maxFileCount: 3 },
    blob: { maxFileSize: "4MB", maxFileCount: 3 },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, key: file.key, name: file.name }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
