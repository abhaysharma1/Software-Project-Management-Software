import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { syncRepoSchema } from "@/validators/github"
import { githubService } from "@/services/github.service"
import { ZodError } from "zod"
import { handleApiError } from "@/lib/app-error"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = syncRepoSchema.parse(body)

    let result
    if (data.repoId) {
      result = await githubService.syncRepository(data.repoId)
    } else if (data.projectId) {
      result = await githubService.syncProjectRepositories(data.projectId)
    } else {
      result = await githubService.syncAllRepositories()
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
