"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0.5 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: !reducedMotion,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [reducedMotion])

  return <>{children}</>
}
