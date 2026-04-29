import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { GeneratorSection } from "@/components/landing/GeneratorSection";
import { StaticVsDynamic } from "@/components/landing/StaticVsDynamic";
import { CaseStudy } from "@/components/landing/CaseStudy";
import { Pricing } from "@/components/landing/Pricing";
import { WhyOnce } from "@/components/landing/WhyOnce";
import { Privacy } from "@/components/landing/Privacy";
import { FAQ } from "@/components/landing/FAQ";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <GeneratorSection />
        <StaticVsDynamic />
        <CaseStudy />
        <Pricing />
        <WhyOnce />
        <Privacy />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
