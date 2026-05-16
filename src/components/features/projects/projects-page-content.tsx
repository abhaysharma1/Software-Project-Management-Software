"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, FolderKanban, MessageSquare, GitBranch, ExternalLink, Filter } from "lucide-react"
import { getInitials, getStatusColor, formatDateRelative } from "@/lib/utils"

interface ProjectItem {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  completionPct: number
  repoUrl: string | null
  liveUrl: string | null
  dueDate: Date | null
  createdAt: Date
  owner: { name: string; image: string | null }
  class: { name: string; code: string }
  group: { members: { user: { name: string } }[] } | null
  _count: { milestones: number; comments: number }
}

export function ProjectsPageContent({ projects }: { projects: ProjectItem[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Monitor all student projects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: string | null) => value && setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PLANNED">Planned</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-sm text-muted-foreground">Projects from your classes will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => (
            <Link key={project.id} href={`/teacher/projects/${project.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={project.owner.image || ""} />
                        <AvatarFallback>{getInitials(project.owner.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <CardDescription>
                          {project.owner.name} &middot; {project.class.code}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace("_", " ")}
                      </Badge>
                      {project.repoUrl && <GitBranch className="h-4 w-4 text-muted-foreground" />}
                      {project.liveUrl && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{project._count.milestones} milestones</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {project._count.comments}
                      </span>
                      {project.group && (
                        <span>{project.group.members.length} members</span>
                      )}
                      <span>{formatDateRelative(project.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={project.completionPct} className="w-24" />
                      <span className="text-sm text-muted-foreground w-8">{project.completionPct}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
