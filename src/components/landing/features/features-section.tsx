"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import {
  Kanban,
  Users,
  GitBranch,
  Milestone,
  BarChart3,
  Bell,
  MessageSquare,
  Award,
  type LucideIcon,
} from "lucide-react"
import { GlowingCard } from "@/components/animation/glowing-card"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { FEATURES } from "@/constants/landing"
import { staggerContainer, staggerItem } from "@/lib/animation"

const iconMap: Record<string, LucideIcon> = {
  Kanban,
  Users,
  GitBranch,
  Milestone,
  BarChart3,
  Bell,
  MessageSquare,
  Award,
}

export function FeaturesSection() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Everything you need
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="text-primary">
              academic teams
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to manage, track, and evaluate student software projects at scale.
          </p>
        </motion.div>

        <motion.div
          variants={!reducedMotion ? staggerContainer : undefined}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.title}
                variants={!reducedMotion ? staggerItem : undefined}
              >
                <GlowingCard
                  gradient={feature.gradient}
                  glowColor={feature.gradient.replace("from-", "").split(" ")[0]?.replace(/^\[?/, "rgba(") || "rgba(16, 185, 129, 0.15)"}
                  className="h-full"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </GlowingCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
