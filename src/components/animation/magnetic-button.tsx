"use client"

import { useRef, type ReactNode, type ButtonHTMLAttributes } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  as?: "button" | "a"
  href?: string
}

export function MagneticButton({
  children,
  className = "",
  as = "button",
  href,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  const Component = as === "a" ? motion.a : motion.button

  return (
    <div
      ref={ref}
      className="inline-block transition-transform duration-300 ease-out"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        whileHover={{ scale: reducedMotion ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={className}
        href={href as string}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </Component>
    </div>
  )
}
