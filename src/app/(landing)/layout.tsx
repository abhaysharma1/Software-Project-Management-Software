import type { ReactNode } from "react"
import { LenisProvider } from "@/components/animation/lenis-provider"
import { AnimatedGrid } from "@/components/animation/animated-grid"

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <AnimatedGrid />
      {children}
    </LenisProvider>
  )
}
