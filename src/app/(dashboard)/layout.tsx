import { SessionProvider } from "@/components/providers/session-provider"
import { SearchProvider } from "@/components/providers/search-provider"
import { Sidebar } from "@/components/layouts/sidebar"
import { Navbar } from "@/components/layouts/navbar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CommandPalette } from "@/components/shared/command-palette"
import { ErrorBoundary } from "@/components/shared/error-boundary"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SearchProvider>
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>
            <CommandPalette />
          </div>
        </TooltipProvider>
      </SearchProvider>
    </SessionProvider>
  )
}
