import Link from "next/link"
import { FileX } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <FileX className="h-16 w-16 text-muted-foreground mb-6" />
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-8 gap-1.5 px-2.5 text-sm font-medium hover:bg-primary/80">
        Go Home
      </Link>
    </div>
  )
}
