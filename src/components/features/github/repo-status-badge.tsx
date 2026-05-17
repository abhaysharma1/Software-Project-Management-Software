"use client"

import { Badge } from "@/components/ui/badge"
import { formatDateRelative } from "@/lib/utils"
import { CheckCircle2, AlertCircle, GitBranch } from "lucide-react"

interface RepoStatusBadgeProps {
  repoCount: number
  lastSyncedAt?: Date | null
}

export function RepoStatusBadge({ repoCount, lastSyncedAt }: RepoStatusBadgeProps) {
  if (repoCount === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <GitBranch className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{repoCount} repo{repoCount > 1 ? "s" : ""}</span>
      {lastSyncedAt ? (
        <Badge variant="outline" className="gap-1">
          <CheckCircle2 className="h-3 w-3 text-primary" />
          Synced {formatDateRelative(lastSyncedAt)}
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1">
          <AlertCircle className="h-3 w-3 text-amber-500" />
          Not synced
        </Badge>
      )}
    </div>
  )
}
