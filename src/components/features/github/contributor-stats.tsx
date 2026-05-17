"use client"

import { GitBranch, GitCommit, Users } from "lucide-react"

interface RepoStats {
  contributorCount: number | null
  commitCount7d: number
  commitCount24h: number
}

interface ContributorStatsProps {
  repos: RepoStats[]
}

export function ContributorStats({ repos }: ContributorStatsProps) {
  const totalContributors = repos.reduce((s, r) => s + (r.contributorCount || 0), 0)
  const totalCommits7d = repos.reduce((s, r) => s + r.commitCount7d, 0)
  const totalCommits24h = repos.reduce((s, r) => s + r.commitCount24h, 0)

  if (repos.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
        <p className="text-lg font-bold">{totalContributors}</p>
        <p className="text-xs text-muted-foreground">Contributors</p>
      </div>
      <div className="text-center">
        <GitCommit className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
        <p className="text-lg font-bold">{totalCommits7d}</p>
        <p className="text-xs text-muted-foreground">Commits/7d</p>
      </div>
      <div className="text-center">
        <GitBranch className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
        <p className="text-lg font-bold">{totalCommits24h}</p>
        <p className="text-xs text-muted-foreground">Commits/24h</p>
      </div>
    </div>
  )
}
