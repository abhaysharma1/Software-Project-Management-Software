"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  GraduationCap,
  BarChart3,
  Bell,
  Settings,
  UserCircle,
  BookOpen,
  Shield,
  ClipboardList,
} from "lucide-react"
import { useSearch } from "@/components/providers/search-provider"

const routes: Record<string, { label: string; icon: React.ReactNode; href: string }[]> = {
  TEACHER: [
    { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, href: "/teacher" },
    { label: "Classes", icon: <GraduationCap className="h-4 w-4" />, href: "/teacher/classes" },
    { label: "Projects", icon: <FolderKanban className="h-4 w-4" />, href: "/teacher/projects" },
    { label: "Groups", icon: <Users className="h-4 w-4" />, href: "/teacher/groups" },
    { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, href: "/teacher/analytics" },
  ],
  STUDENT: [
    { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, href: "/student" },
    { label: "My Projects", icon: <FolderKanban className="h-4 w-4" />, href: "/student/projects" },
    { label: "My Groups", icon: <Users className="h-4 w-4" />, href: "/student/groups" },
  ],
  ADMIN: [
    { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, href: "/admin" },
    { label: "Users", icon: <Shield className="h-4 w-4" />, href: "/admin/users" },
    { label: "Classes", icon: <GraduationCap className="h-4 w-4" />, href: "/admin/classes" },
    { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, href: "/admin/analytics" },
    { label: "Logs", icon: <ClipboardList className="h-4 w-4" />, href: "/admin/logs" },
  ],
  COMMON: [
    { label: "Notifications", icon: <Bell className="h-4 w-4" />, href: "/notifications" },
    { label: "Profile", icon: <UserCircle className="h-4 w-4" />, href: "/profile" },
    { label: "Settings", icon: <Settings className="h-4 w-4" />, href: "/settings" },
  ],
}

export function CommandPalette() {
  const router = useRouter()
  const { data: session } = useSession()
  const { open, setOpen } = useSearch()
  const role = session?.user?.role || ""

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  const runCommand = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router, setOpen])

  const roleRoutes = routes[role as keyof typeof routes] || []

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {roleRoutes.length > 0 && (
          <CommandGroup heading="Navigation">
            {roleRoutes.map((r) => (
              <CommandItem key={r.href} onSelect={() => runCommand(r.href)}>
                {r.icon}
                <span>{r.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="General">
          {routes.COMMON.map((r) => (
            <CommandItem key={r.href} onSelect={() => runCommand(r.href)}>
              {r.icon}
              <span>{r.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
