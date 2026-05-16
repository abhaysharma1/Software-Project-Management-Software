"use client"

import { useRef } from "react"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface SpotlightEffectProps {
  className?: string
  size?: number
  opacity?: number
  color?: string
}

export function SpotlightEffect({
  className,
  size = 600,
  opacity = 0.15,
  color = "rgb(139, 92, 246)",
}: SpotlightEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { x, y } = useMousePosition(ref)
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
        style={{
          width: size,
          height: size,
          left: x,
          top: y,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
        }}
      />
    </div>
  )
}
