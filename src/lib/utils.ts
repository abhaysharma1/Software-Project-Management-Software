import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateRelative(date: Date | string) {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(date)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PLANNED: "bg-muted text-muted-foreground",
    IN_PROGRESS: "bg-primary/10 text-primary",
    REVIEW: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    COMPLETED: "bg-primary/10 text-primary",
    ARCHIVED: "bg-muted text-muted-foreground",
    PENDING: "bg-muted text-muted-foreground",
    SUBMITTED: "bg-primary/10 text-primary",
    APPROVED: "bg-primary/10 text-primary",
    REJECTED: "bg-destructive/10 text-destructive",
  }
  return colors[status] || colors.PENDING
}
