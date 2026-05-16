"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface TextRevealProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  delay?: number
  stagger?: number
  once?: boolean
}

export function TextReveal({
  children,
  className,
  as: Tag = "p",
  delay = 0,
  stagger = 0.02,
  once = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return

    const chars = containerRef.current.querySelectorAll(".reveal-char")
    if (chars.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 40, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger,
          delay,
          ease: "back.out(1.7)",
          scrollTrigger: once
            ? {
                trigger: containerRef.current,
                start: "top 85%",
                once: true,
              }
            : undefined,
        }
      )
    })

    return () => ctx.revert()
  }, [reducedMotion, delay, stagger, once])

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const words = children.split(" ")

  return (
    <Tag className={cn("inline", className)}>
      <span ref={containerRef} className="inline">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <span
                key={`${wi}-${ci}`}
                className="reveal-char inline-block opacity-0"
                style={{ perspective: "1000px" }}
              >
                {char}
              </span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </Tag>
  )
}
