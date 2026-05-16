"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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
  const lineRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !lineRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>(".step-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

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
          <div
            ref={lineRef}
            className="absolute left-8 top-0 hidden h-full w-px origin-top bg-border md:block"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="space-y-16 md:space-y-24">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = iconMap[step.icon]
              const isLeft = i % 2 === 0
              return (
                <div
                  key={step.step}
                  className={cn(
                    "step-card relative flex flex-col md:flex-row",
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
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
