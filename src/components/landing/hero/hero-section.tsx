"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { MagneticButton } from "@/components/animation/magnetic-button"
import { SpotlightEffect } from "@/components/animation/spotlight-effect"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { HERO_CONTENT } from "@/constants/landing"

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const wordVariants: Variants = {
  hidden: { y: 80, opacity: 0, rotateX: -45 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
  },
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
}

const previewVariants: Variants = {
  hidden: { y: 80, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } },
}

export function HeroSection() {
  const reducedMotion = useReducedMotion()
  const [sidebarWidths] = useState(() =>
    ["Projects", "Teams", "Analytics", "Settings"].map(() => 60 + Math.random() * 30)
  )
  const [barHeights] = useState(() =>
    [1, 2, 3, 4, 5].map(() => 20 + Math.random() * 30)
  )

  const headline = HERO_CONTENT.title.split("\n")

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 animate-pulse-glow"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.08) 2px, hsl(var(--primary) / 0.08) 4px)",
            backgroundSize: "100% 4px",
          }}
        />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            {HERO_CONTENT.badge}
          </motion.div>

          <motion.h1
            variants={!reducedMotion ? containerVariants : undefined}
            initial="hidden"
            animate="visible"
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {headline.map((line, i) => (
              <span key={i} className="block">
                {line.split(" ").map((word, j) => (
                  <motion.span
                    key={`${i}-${j}`}
                    variants={!reducedMotion ? wordVariants : undefined}
                    className="mr-[0.3em] inline-block"
                    style={{ perspective: "1000px" }}
                  >
                    {word === "Project" || word === "Academia" ? (
                      <span className="text-primary">{word}</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={!reducedMotion ? itemVariants : undefined}
            initial="hidden"
            animate="visible"
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            {HERO_CONTENT.subtitle}
          </motion.p>

          <motion.div
            variants={!reducedMotion ? { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } } : undefined}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div variants={!reducedMotion ? itemVariants : undefined}>
              <MagneticButton as="a" href="/register">
                <span className="group relative inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                  {HERO_CONTENT.primaryCta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </motion.div>

            <motion.div variants={!reducedMotion ? itemVariants : undefined}>
              <MagneticButton>
                <span
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white/10"
                  onClick={() => {
                    document
                      .querySelector("#dashboard-showcase")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <Play className="h-4 w-4" />
                  {HERO_CONTENT.secondaryCta.label}
                </span>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={!reducedMotion ? previewVariants : undefined}
          initial="hidden"
          animate="visible"
          className="relative mt-20"
        >
          <div className="animate-float absolute -left-4 -top-4 z-10 hidden rounded-lg border border-white/10 bg-background/80 px-3 py-2 text-xs backdrop-blur-xl lg:block">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">12 active projects</span>
            </div>
          </div>

          <div className="animate-float-delayed absolute -bottom-4 -right-4 z-10 hidden rounded-lg border border-white/10 bg-background/80 px-3 py-2 text-xs backdrop-blur-xl lg:block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">98% completion rate</span>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">DevTrack Dashboard</span>
            </div>

            <div className="grid grid-cols-4 gap-px bg-white/5">
              <div className="col-span-1 border-r border-white/5 bg-white/[0.02] p-4">
                <div className="mb-4 h-2 w-20 rounded bg-white/10" />
                <div className="space-y-3">
                  {["Projects", "Teams", "Analytics", "Settings"].map((item, idx) => (
                    <div
                      key={item}
                      className="h-2 rounded bg-white/10"
                      style={{ width: `${sidebarWidths[idx]}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-span-3 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-32 rounded bg-white/10" />
                  <div className="h-6 w-20 rounded-lg bg-primary/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="mb-2 h-2 w-16 rounded bg-white/10" />
                      <div className="mb-1 h-6 w-12 rounded bg-primary/20" />
                      <div className="h-2 w-24 rounded bg-white/5" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-2 h-2 w-20 rounded bg-white/10" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((d, idx) => (
                        <div
                          key={d}
                          className="h-8 flex-1 rounded-sm bg-primary/20"
                          style={{ height: `${barHeights[idx]}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-2 h-2 w-16 rounded bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-24 rounded bg-white/10" />
                        <div className="h-2 w-16 rounded bg-white/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SpotlightEffect size={400} opacity={0.08} />
        </motion.div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by leading institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {HERO_CONTENT.trustedBy.map((institution) => (
              <span
                key={institution.name}
                className="text-sm font-semibold tracking-wide text-foreground"
              >
                {institution.logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
