"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

export function GSAPProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    })

    if (reducedMotion) {
      ScrollTrigger.config({ limitCallbacks: true })
      gsap.timeline().defaults({ duration: 0.01 })
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [reducedMotion])

  return <>{children}</>
}
