import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Users, FolderKanban } from "lucide-react"

export default async function AdminClassesPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/login")

  const classes = await prisma.class.findMany({
    include: {
      teacher: { select: { name: true } },
      _count: { select: { members: true, projects: true, groups: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Classes</h1>
        <p className="text-muted-foreground">System-wide class overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cls.code}</p>
                </div>
                <Badge variant={cls.isActive ? "default" : "secondary"}>
                  {cls.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Teacher: {cls.teacher.name}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {cls._count.members}</span>
                <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" /> {cls._count.projects}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {cls._count.groups}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
