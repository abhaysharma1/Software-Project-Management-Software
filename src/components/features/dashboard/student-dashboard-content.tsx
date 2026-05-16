"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FolderKanban,
  Users,
  Bell,
  Calendar,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  GitBranch,
  ExternalLink,
} from "lucide-react"
import { formatDate, formatDateRelative, getInitials, getStatusColor } from "@/lib/utils"
import type { Milestone, Group, GroupMember } from "@prisma/client"

interface StudentProject {
  id: string
  title: string
  description: string | null
  status: string
  completionPct: number
  repoUrl: string | null
  liveUrl: string | null
  dueDate: Date | null
  milestones: Milestone[]
  group: (Group & { members: (GroupMember & { user: { name: string; image: string | null } })[] }) | null
}

interface StudentDashboardProps {
  projects: StudentProject[]
  notifications: { id: string; title: string; message: string; createdAt: Date }[]
  upcomingSubmissions: { id: string; title: string; dueDate: Date | null; project: { title: string } }[]
  completionPct: number
  teamMembers: { name: string; image: string | null }[]
  groupMemberships: { group: { project: { title: string } | null; name: string } }[]
}

export function StudentDashboardContent({
  projects,
  notifications,
  upcomingSubmissions,
  completionPct,
  teamMembers,
  groupMemberships,
}: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Track your projects and submissions</p>
        </div>
        <Link href="/student/projects" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-8 gap-1.5 px-2.5 text-sm font-medium hover:bg-primary/80">
            <Plus className="h-4 w-4" />
            New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupMemberships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPct}%</div>
            <Progress value={completionPct} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* My Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Projects</CardTitle>
              <CardDescription>Your active and planned projects</CardDescription>
            </div>
            <Link href="/student/projects" className="inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted h-7 gap-1 px-2.5 text-[0.8rem] font-medium">
                View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderKanban className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No projects yet</p>
                <p className="text-xs text-muted-foreground">Create your first project to get started</p>
                <Link href="/student/projects" className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-7 gap-1 px-2.5 text-[0.8rem] font-medium hover:bg-primary/80">
                    <Plus className="h-4 w-4" />
                    Create Project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link key={project.id} href={`/student/projects/${project.id}`}>
                    <Card className="transition-colors hover:bg-accent/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{project.title}</CardTitle>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Progress value={project.completionPct} className="flex-1 mr-4" />
                          <span className="text-sm text-muted-foreground">{project.completionPct}%</span>
                        </div>
                        {project.dueDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Due: {formatDate(project.dueDate)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team & Notifications */}
        <div className="space-y-6">
          {/* Team Members */}
          {teamMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member, i) => (
                    <Avatar key={i} className="h-8 w-8">
                      <AvatarImage src={member.image || ""} />
                      <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {upcomingSubmissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingSubmissions.map((ms) => (
                      <div key={ms.id} className="border-b pb-2 last:border-0">
                        <p className="text-sm font-medium">{ms.title}</p>
                        <p className="text-xs text-muted-foreground">{ms.project.title}</p>
                        {ms.dueDate && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Due {formatDate(ms.dueDate)}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="border-b pb-2 last:border-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDateRelative(n.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
