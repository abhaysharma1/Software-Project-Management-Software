"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft, GitBranch, ExternalLink, Calendar, MessageSquare,
  CheckCircle2, XCircle, Clock, Users, FileText, Loader2, Send,
  ChevronDown, ChevronUp, Award,
} from "lucide-react"
import { getInitials, getStatusColor, formatDate, formatDateRelative } from "@/lib/utils"
import { toast } from "sonner"
import type { Milestone, MilestoneSubmission, Comment, GitHubRepository, ActivityLog, Group, GroupMember } from "@prisma/client"

interface ProjectDetail {
  id: string
  title: string
  description: string | null
  techStack: string
  status: string
  priority: string
  completionPct: number
  repoUrl: string | null
  liveUrl: string | null
  dueDate: Date | null
  tags: string
  owner: { id: string; name: string; image: string | null; email: string }
  class: { id: string; name: string; code: string; teacherId: string }
  group: (Group & { members: (GroupMember & { user: { id: string; name: string; image: string | null } })[] }) | null
  milestones: (Milestone & { submissions: (MilestoneSubmission & { user: { id: string; name: string; image: string | null } })[] })[]
  comments: (Comment & { user: { id: string; name: string; image: string | null }; replies: (Comment & { user: { id: string; name: string; image: string | null } })[] })[]
  repositories: GitHubRepository[]
  activities: (ActivityLog & { user: { name: string; image: string | null } })[]
}

export function TeacherProjectDetail({ project, userId }: { project: ProjectDetail; userId: string }) {
  const router = useRouter()
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [gradingStates, setGradingStates] = useState<Record<string, { grade: string; feedback: string; open: boolean }>>({})

  const techStack = parseJsonArray(project.techStack)
  const tags = parseJsonArray(project.tags)

  function parseJsonArray(val: string): string[] {
    try { return JSON.parse(val) } catch { return [] }
  }

  async function addComment() {
    if (!commentText.trim()) return
    setSubmitting("comment")
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText, projectId: project.id }),
      })
      if (!res.ok) { toast.error("Failed to add comment"); return }
      setCommentText("")
      toast.success("Comment added")
      setSubmitting(null)
      router.refresh()
    } catch { toast.error("Something went wrong"); setSubmitting(null) }
  }

  async function gradeSubmission(submissionId: string, milestoneId: string) {
    const state = gradingStates[submissionId]
    if (!state || !state.grade) return

    setSubmitting(`grade-${submissionId}`)
    try {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          grade: parseInt(state.grade),
          feedback: state.feedback,
        }),
      })
      if (!res.ok) { toast.error("Failed to grade"); setSubmitting(null); return }
      toast.success("Graded successfully")
      setGradingStates((prev) => ({ ...prev, [submissionId]: { ...prev[submissionId], open: false } }))
      setSubmitting(null)
      router.refresh()
    } catch { toast.error("Something went wrong"); setSubmitting(null) }
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/teacher/projects" className="inline-flex items-center justify-center rounded-md hover:bg-accent h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
            <Badge variant="outline" className="capitalize">{project.priority}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{project.class.code} &middot; {project.owner.name}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Overview */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview Card */}
          <Card>
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {project.description && <p className="text-sm">{project.description}</p>}
              <Progress value={project.completionPct} className="w-full" />
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {project.dueDate ? formatDate(project.dueDate) : "No due date"}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {project.group?.members.length ?? 1} members</span>
                <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {project.milestones.length} milestones</span>
              </div>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              )}
              <div className="flex gap-2">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <GitBranch className="h-4 w-4" /> Repository
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                )}
              </div>
              {project.group && (
                <div>
                  <p className="text-sm font-medium mb-2">Team Members</p>
                  <div className="flex flex-wrap gap-2">
                    {project.group.members.map((m) => (
                      <div key={m.user.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                        <Avatar className="h-5 w-5"><AvatarImage src={m.user.image || ""} /><AvatarFallback className="text-[8px]">{getInitials(m.user.name)}</AvatarFallback></Avatar>
                        <span className="text-xs">{m.user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
            <CardContent>
              {project.milestones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No milestones defined</p>
              ) : (
                <div className="space-y-4">
                  {project.milestones.map((ms) => {
                    const submission = ms.submissions[0]
                    const gs = gradingStates[submission?.id || ""] || { grade: "", feedback: "", open: false }
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
                                    onChange={(e) => setGradingStates((p) => ({ ...p, [submission.id]: { ...p[submission.id], grade: e.target.value } }))} />
                                  <Button size="sm" onClick={() => gradeSubmission(submission.id, ms.id)} disabled={submitting !== null || !gs.grade}>
                                    {submitting === `grade-${submission.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Award className="h-3 w-3" />}
                                    {submitting === `grade-${submission.id}` ? "Grading..." : "Grade"}
                                  </Button>
                                </div>
                                <Input placeholder="Feedback (optional)" value={gs.feedback}
                                  onChange={(e) => setGradingStates((p) => ({ ...p, [submission.id]: { ...p[submission.id], feedback: e.target.value } }))} />
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
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader><CardTitle>Comments & Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="min-h-[80px]" disabled={submitting === "comment"} />
              </div>
              <Button onClick={addComment} disabled={submitting !== null || !commentText.trim()}>
                {submitting === "comment" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {submitting === "comment" ? "Posting..." : "Post Comment"}
              </Button>
              <Separator />
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {project.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8"><AvatarImage src={comment.user.image || ""} /><AvatarFallback className="text-xs">{getInitials(comment.user.name)}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{formatDateRelative(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 ml-12">
                          <Avatar className="h-7 w-7"><AvatarImage src={reply.user.image || ""} /><AvatarFallback className="text-[10px]">{getInitials(reply.user.name)}</AvatarFallback></Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{reply.user.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDateRelative(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm mt-1">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity + GitHub */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {project.activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-2 text-sm border-b pb-2 last:border-0">
                      <Avatar className="h-6 w-6"><AvatarImage src={a.user.image || ""} /><AvatarFallback className="text-[8px]">{getInitials(a.user.name)}</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <p><span className="font-medium">{a.user.name}</span> {a.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDateRelative(a.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* GitHub Repos */}
          {project.repositories.length > 0 && (
            <Card>
              <CardHeader><CardTitle>GitHub Repositories</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {project.repositories.map((repo) => (
                  <div key={repo.id} className="border rounded p-3">
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> {repo.fullName}
                    </a>
                    {repo.lastCommitMsg && <p className="text-xs text-muted-foreground mt-1">{repo.lastCommitMsg}</p>}
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                      {repo.lastCommitAt && <span>Last commit: {formatDateRelative(repo.lastCommitAt)}</span>}
                      {repo.contributorCount !== null && <span>{repo.contributorCount} contributors</span>}
                      <span>{repo.commitCount7d} commits/7d</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
