"use client"

import { formatDateRelative } from "@/lib/utils"
import { GitCommit } from "lucide-react"

interface CommitActivity {
  id: string
  fullName: string
  url: string
  lastCommitMsg: string | null
  lastCommitAt: Date | null
  commitCount7d: number
  commitCount24h: number
}

interface CommitActivityFeedProps {
  repos: CommitActivity[]
}

export function CommitActivityFeed({ repos }: CommitActivityFeedProps) {
  if (repos.length === 0) return null

  return (
    <div className="space-y-2">
      {repos.map((repo) => (
        <div key={repo.id} className="flex items-start gap-2 text-sm border-b pb-2 last:border-0">
          <GitCommit className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              {repo.fullName}
            </a>
            {repo.lastCommitMsg && <p className="text-xs text-muted-foreground">{repo.lastCommitMsg}</p>}
            <p className="text-xs text-muted-foreground">
              {repo.lastCommitAt ? formatDateRelative(repo.lastCommitAt) : "No commits yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
