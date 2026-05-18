import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.3_0.1_80/0.15)_0%,_transparent_70%)]" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Learn to invest before you invest real money
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Trade virtual stocks, replay historic market crashes, and compete
          in monthly tournaments
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-amber-500 text-emerald-950 hover:bg-amber-400"
        >
          <Link href="/register">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
