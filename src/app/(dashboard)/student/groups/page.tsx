import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, getStatusColor } from "@/lib/utils"
import { Users } from "lucide-react"

export default async function StudentGroupsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const memberships = await prisma.groupMember.findMany({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          class: { select: { name: true, code: true } },
          project: { select: { title: true, status: true } },
          members: { include: { user: { select: { id: true, name: true, image: true } } } },
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Groups</h1>
        <p className="text-muted-foreground">Your group memberships</p>
      </div>

      {memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No groups yet</h3>
          <p className="text-sm text-muted-foreground">You haven&apos;t been assigned to any group</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memberships.map((m) => (
            <Card key={m.group.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{m.group.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{m.group.class.code}</p>
                  </div>
                  {m.group.project && (
                    <Badge className={getStatusColor(m.group.project.status)}>
                      {m.group.project.status.replace("_", " ")}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {m.group.project && (
                  <p className="text-sm font-medium mb-3">Project: {m.group.project.title}</p>
                )}
                <p className="text-sm text-muted-foreground mb-3">{m.group.members.length} members</p>
                <div className="flex flex-wrap gap-2">
                  {m.group.members.map((member) => (
                    <div key={member.user.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.user.image || ""} />
                        <AvatarFallback className="text-[8px]">{getInitials(member.user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{member.user.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
