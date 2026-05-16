"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react"
import { formatDate, formatDateRelative, getInitials } from "@/lib/utils"

interface DashboardProps {
  classes: { id: string; name: string; code: string; _count: { members: number; projects: number } }[]
  projectsCount: number
  pendingReviews: number
  activeGroups: number
  completionPct: number
  upcomingDeadlines: { id: string; title: string; dueDate: Date | null; project: { title: string } }[]
  recentActivity: {
    id: string
    type: string
    description: string
    createdAt: Date
    user: { name: string; image: string | null }
    project: { title: string } | null
  }[]
}

export function TeacherDashboardContent({
  classes,
  projectsCount,
  pendingReviews,
  activeGroups,
  completionPct,
  upcomingDeadlines,
  recentActivity,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your classes and projects</p>
        </div>
        <Link href="/teacher/classes" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-8 gap-1.5 px-2.5 text-sm font-medium hover:bg-primary/80">
            <Plus className="h-4 w-4" />
            New Class
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCount}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Milestones awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGroups}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPct}%</div>
            <Progress value={completionPct} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Deadlines */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Milestones due soon</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">{deadline.project.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{deadline.dueDate ? formatDate(deadline.dueDate) : "No date"}</p>
                      <Badge variant="outline" className="text-xs">
                        {deadline.dueDate && new Date(deadline.dueDate) > new Date()
                          ? `${Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d remaining`
                          : "Overdue"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.image || ""} />
                        <AvatarFallback className="text-xs">{getInitials(activity.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>{" "}
                          {activity.description.toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.project?.title} &middot; {formatDateRelative(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Your Classes
            </CardTitle>
            <CardDescription>Manage your classes and monitor progress</CardDescription>
          </div>
          <Link href="/teacher/classes" className="inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted h-7 gap-1 px-2.5 text-[0.8rem] font-medium">
              View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No classes yet</p>
              <p className="text-xs text-muted-foreground">Create your first class to get started</p>
              <Link href="/teacher/classes" className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-7 gap-1 px-2.5 text-[0.8rem] font-medium hover:bg-primary/80">
                  <Plus className="h-4 w-4" />
                  Create Class
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <Link key={cls.id} href={`/teacher/classes`}>
                  <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{cls.name}</CardTitle>
                      <CardDescription>{cls.code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {cls._count.members}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" /> {cls._count.projects}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
