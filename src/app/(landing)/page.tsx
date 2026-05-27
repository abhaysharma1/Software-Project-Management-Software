import { Navbar } from "@/components/landing/navbar/navbar"
import { HeroSection } from "@/components/landing/hero/hero-section"
import { FeaturesSection } from "@/components/landing/features/features-section"
import dynamic from "next/dynamic"

const DashboardShowcaseSection = dynamic(() =>
  import("@/components/landing/dashboard-showcase/dashboard-showcase-section").then((m) => m.DashboardShowcaseSection)
)
const HowItWorksSection = dynamic(() =>
  import("@/components/landing/how-it-works/how-it-works-section").then((m) => m.HowItWorksSection)
)
const GithubIntegrationSection = dynamic(() =>
  import("@/components/landing/github-integration/github-integration-section").then((m) => m.GithubIntegrationSection)
)
const AnalyticsSection = dynamic(() =>
  import("@/components/landing/analytics/analytics-section").then((m) => m.AnalyticsSection)
)
const TestimonialsSection = dynamic(() =>
  import("@/components/landing/testimonials/testimonials-section").then((m) => m.TestimonialsSection)
)
const PricingSection = dynamic(() =>
  import("@/components/landing/pricing/pricing-section").then((m) => m.PricingSection)
)
const FAQSection = dynamic(() =>
  import("@/components/landing/faq/faq-section").then((m) => m.FAQSection)
)
const CTASection = dynamic(() =>
  import("@/components/landing/cta/cta-section").then((m) => m.CTASection)
)
const FooterSection = dynamic(() =>
  import("@/components/landing/footer/footer-section").then((m) => m.FooterSection)
)

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
