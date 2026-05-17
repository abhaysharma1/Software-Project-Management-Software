"use client"

import { Badge } from "@/components/ui/badge"
import { getInitials, getStatusColor, formatDate, formatDateRelative } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Award, CheckCircle2, XCircle } from "lucide-react"

interface Submission {
  id: string
  content: string | null
  grade: number | null
  feedback: string | null
  createdAt: Date
  user: { id: string; name: string; image: string | null }
}

interface MilestoneItem {
  id: string
  title: string
  description: string | null
  status: string
  order: number
  weight: number
  dueDate: Date | null
  submissions: Submission[]
}

interface MilestoneListProps {
  milestones: MilestoneItem[]
  onGrade: (submissionId: string, grade: number, feedback: string) => void
  isGrading: string | null
  gradingStates: Record<string, { grade: string; feedback: string }>
  onGradingChange: (submissionId: string, field: "grade" | "feedback", value: string) => void
}

export function MilestoneList({ milestones, onGrade, isGrading, gradingStates, onGradingChange }: MilestoneListProps) {
  if (milestones.length === 0) {
    return <p className="text-sm text-muted-foreground">No milestones defined</p>
  }

  return (
    <div className="space-y-4">
      {milestones.map((ms) => {
        const submission = ms.submissions[0]
        const gs = gradingStates[submission?.id || ""] || { grade: "", feedback: "" }
        return (
          <div key={ms.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{ms.order}</span>
                  <span className="font-medium">{ms.title}</span>
                  <Badge className={getStatusColor(ms.status)}>{ms.status.replace("_", " ")}</Badge>
                </div>
                {ms.description && <p className="text-xs text-muted-foreground mt-1">{ms.description}</p>}
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {ms.dueDate && <p>Due: {formatDate(ms.dueDate)}</p>}
                <p>Weight: {ms.weight}</p>
              </div>
            </div>

            {submission && ms.status === "SUBMITTED" && (
              <div className="mt-3 bg-muted/50 rounded p-3 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-5 w-5"><AvatarImage src={submission.user.image || ""} /><AvatarFallback className="text-[8px]">{getInitials(submission.user.name)}</AvatarFallback></Avatar>
                    <span className="text-xs font-medium">{submission.user.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDateRelative(submission.createdAt)}</span>
                  </div>
                  <p className="text-sm">{submission.content}</p>
                </div>

                {!submission.grade ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input type="number" min={0} max={100} placeholder="Grade (0-100)" className="w-32"
                        value={gs.grade}
                        onChange={(e) => onGradingChange(submission.id, "grade", e.target.value)} />
                      <Button size="sm" onClick={() => onGrade(submission.id, parseInt(gs.grade) || 0, gs.feedback)} disabled={isGrading !== null || !gs.grade}>
                        {isGrading === `grade-${submission.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Award className="h-3 w-3" />}
                        {isGrading === `grade-${submission.id}` ? "Grading..." : "Grade"}
                      </Button>
                    </div>
                    <Input placeholder="Feedback (optional)" value={gs.feedback}
                      onChange={(e) => onGradingChange(submission.id, "feedback", e.target.value)} />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-bold text-lg">{submission.grade}/100</span>
                    {submission.feedback && <span className="text-muted-foreground">&ldquo;{submission.feedback}&rdquo;</span>}
                  </div>
                )}
              </div>
            )}

            {submission?.grade !== null && submission && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                {submission.grade !== null && submission.grade >= 50
                  ? <CheckCircle2 className="h-4 w-4 text-primary" />
                  : submission.grade !== null
                    ? <XCircle className="h-4 w-4 text-destructive" />
                    : null}
                <span className={submission.grade !== null && submission.grade >= 50 ? "text-primary" : "text-destructive"}>
                  {submission.grade !== null ? `Grade: ${submission.grade}/100` : ""}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
