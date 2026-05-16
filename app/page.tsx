"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { AuthForm } from "@/components/home/AuthForm";
import { FeatureCards } from "@/components/home/FeatureCards";
import { DashboardWelcome } from "@/components/home/DashboardWelcome";
import { useAuth } from "@/src/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex flex-1 items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </main>
      </>
    );
  }

  if (user) {
    return (
      <>
        <Navbar />
        <DashboardWelcome user={user} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <AuthForm />
        <FeatureCards />
      </main>
    </>
  );
}
