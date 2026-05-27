"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  GraduationCap,
  Users,
  GitBranch,
  GitCommitHorizontal,
  BarChart3,
  type LucideIcon,
} from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { HOW_IT_WORKS } from "@/constants/landing"
import { staggerContainer, staggerItem } from "@/lib/animation"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Users,
  GitBranch,
  GitCommitHorizontal,
  BarChart3,
}

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 40%"],
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Simple workflow
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            From classroom to{" "}
            <span className="text-primary">
              completion
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Set up your course in minutes. Track progress throughout the semester.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 hidden h-full w-px origin-top bg-border md:block"
            style={{ scaleY: reducedMotion ? 1 : lineScale }}
          />

          <motion.div
            variants={!reducedMotion ? staggerContainer : undefined}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-16 md:space-y-24"
          >
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = iconMap[step.icon]
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={step.step}
                  variants={!reducedMotion ? staggerItem : undefined}
                  className={cn(
                    "relative flex flex-col md:flex-row",
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  <div className="hidden md:block md:w-1/2" />

                  <div className="absolute left-8 top-0 z-10 hidden md:flex md:left-1/2 md:-translate-x-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-background shadow-lg">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "ml-16 md:ml-0 md:w-1/2",
                      isLeft ? "md:pr-16" : "md:pl-16"
                    )}
                  >
                    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/20">
                      <div className="mb-8 flex items-center gap-3 md:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                        </div>
                      </div>
                      <span className="mb-2 inline-block text-xs font-medium text-primary">
                        Step {step.step}
                      </span>
                      <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
