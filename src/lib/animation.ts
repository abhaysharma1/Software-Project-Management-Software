import { type ClassValue } from "clsx"

export const animationDefaults = {
  duration: { fast: 0.3, normal: 0.6, slow: 1, verySlow: 1.5 },
  stagger: { fast: 0.05, normal: 0.1, slow: 0.15 },
  ease: {
    out: [0.16, 1, 0.3, 1] as [number, number, number, number],
    inOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
    smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
}

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: {
    duration: 0.6,
    delay,
    ease: animationDefaults.ease.out,
  },
})

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: animationDefaults.ease.out },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: animationDefaults.ease.out },
}

export const slideInRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: animationDefaults.ease.out },
}

export const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  viewport: { once: true, margin: "-50px" },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: animationDefaults.ease.out },
  },
  viewport: { once: true },
}

export function cn(...inputs: ClassValue[]) {
  const { twMerge } = require("tailwind-merge")
  const { clsx } = require("clsx")
  return twMerge(clsx(inputs))
}

export type AnimationVariant =
  | "fadeIn"
  | "fadeInUp"
  | "scaleIn"
  | "slideInLeft"
  | "slideInRight"
  | "stagger"
