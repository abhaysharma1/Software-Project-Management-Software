import { Navbar } from "@/components/landing/navbar/navbar"
import { HeroSection } from "@/components/landing/hero/hero-section"
import { FeaturesSection } from "@/components/landing/features/features-section"
import { DashboardShowcaseSection } from "@/components/landing/dashboard-showcase/dashboard-showcase-section"
import { HowItWorksSection } from "@/components/landing/how-it-works/how-it-works-section"
import { GithubIntegrationSection } from "@/components/landing/github-integration/github-integration-section"
import { AnalyticsSection } from "@/components/landing/analytics/analytics-section"
import { TestimonialsSection } from "@/components/landing/testimonials/testimonials-section"
import { PricingSection } from "@/components/landing/pricing/pricing-section"
import { FAQSection } from "@/components/landing/faq/faq-section"
import { CTASection } from "@/components/landing/cta/cta-section"
import { FooterSection } from "@/components/landing/footer/footer-section"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardShowcaseSection />
      <HowItWorksSection />
      <GithubIntegrationSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}
