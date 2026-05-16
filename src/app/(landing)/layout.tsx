import type { ReactNode } from "react"
import { GSAPProvider } from "@/components/animation/gsap-provider"
import { LenisProvider } from "@/components/animation/lenis-provider"
import { AnimatedGrid } from "@/components/animation/animated-grid"

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <GSAPProvider>
      <LenisProvider>
        <AnimatedGrid />
        {children}
      </LenisProvider>
    </GSAPProvider>
  )
}
