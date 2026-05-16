"use client"

import { useRef, useEffect } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface AnimatedGridProps {
  className?: string
  lineColor?: string
  opacity?: number
}

export function AnimatedGrid({
  className = "",
  lineColor = "rgba(255,255,255,0.03)",
  opacity = 0.5,
}: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      time += 0.005
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      const spacing = 60
      const offset = time * 20

      ctx.strokeStyle = lineColor
      ctx.lineWidth = 0.5

      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath()
        for (let y = 0; y < h; y += 10) {
          const wave = Math.sin((y + offset) * 0.02) * 5
          const nx = x + wave
          if (y === 0) ctx.moveTo(nx, y)
          else ctx.lineTo(nx, y)
        }
        ctx.stroke()
      }

      for (let y = 0; y < h; y += spacing) {
        ctx.beginPath()
        for (let x = 0; x < w; x += 10) {
          const wave = Math.sin((x + offset) * 0.02) * 5
          const ny = y + wave
          if (x === 0) ctx.moveTo(x, ny)
          else ctx.lineTo(x, ny)
        }
        ctx.stroke()
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [reducedMotion, lineColor])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
