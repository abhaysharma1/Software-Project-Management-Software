"use client"

import { motion, type Variants } from "framer-motion"
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

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0,
    },
  },
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
  },
}

export function TextReveal({
  children,
  className,
  as: Tag = "p",
  once = true,
}: TextRevealProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const words = children.split(" ")

  return (
    <Tag className={cn("inline", className)}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={once ? { once: true, margin: "-15%" } : undefined}
        className="inline"
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <motion.span
                key={`${wi}-${ci}`}
                variants={charVariants}
                className="inline-block"
                style={{ perspective: "1000px" }}
              >
                {char}
              </motion.span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
