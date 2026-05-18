"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { AppGuide } from "@/components/home/AppGuide";
import { GlossaryAccordion } from "@/components/glossary/GlossaryAccordion";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <FeatureCards />

        <section className="w-full px-4 pb-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
              How INVEXTO works
            </h2>
            <AppGuide />
          </div>
        </section>

        <section className="w-full px-4 pb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl">
              Learn the language of investing
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Master these terms to trade like a pro
            </p>
            <GlossaryAccordion />
          </div>
        </section>
      </main>
    </>
  );
}
