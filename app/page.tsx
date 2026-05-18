"use client";

import { BookOpen } from "lucide-react";
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

        <section className="relative w-full overflow-hidden px-4 pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_oklch(0.3_0.08_160/0.08)_0%,_transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/30 bg-emerald-950/30 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300/70">
                <BookOpen className="h-3 w-3" />
                Glossary
              </span>
              <h2 className="mt-4 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                Learn the language of investing
              </h2>
              <p className="mt-2 text-sm text-muted-foreground/70">
                Master these terms to trade like a pro
              </p>
            </div>
            <GlossaryAccordion />
          </div>
        </section>
      </main>
    </>
  );
}
