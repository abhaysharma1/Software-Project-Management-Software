"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"
import { GlowingCard } from "@/components/animation/glowing-card"
import { MagneticButton } from "@/components/animation/magnetic-button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { PRICING_PLANS } from "@/constants/landing"
import { staggerContainer, staggerItem } from "@/lib/animation"
import { cn } from "@/lib/utils"

export function PricingSection() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Simple pricing
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Plans for every{" "}
            <span className="text-primary">
              institution
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free. Scale as your program grows.
          </p>
        </motion.div>

        <motion.div
          variants={!reducedMotion ? staggerContainer : undefined}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
        >
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={!reducedMotion ? staggerItem : undefined}
              className="relative"
            >
              {plan.featured && (
                <div className="absolute -inset-px rounded-2xl bg-primary/20 opacity-30 blur-sm" />
              )}
              <div
                className={cn(
                  "relative rounded-2xl border bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm",
                  plan.featured ? "border-primary/50" : "border-white/10"
                )}
              >
                {plan.featured && (
                  <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="mb-2 text-lg font-semibold">{plan.name}</h3>
                <p className="mb-4 text-xs text-muted-foreground">{plan.description}</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mb-8 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="mt-px h-3.5 w-3.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <MagneticButton as="a" href={plan.href}>
                  <span
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                      plan.featured
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
                        : "border border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                    )}
                  >
                    {plan.cta}
                  </span>
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
