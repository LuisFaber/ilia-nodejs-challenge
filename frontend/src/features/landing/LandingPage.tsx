"use client";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,1)_60%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] dark:hidden" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none fixed inset-0 -z-10 hidden opacity-[0.03] dark:block" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none fixed left-1/2 top-1/2 -z-10 hidden h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 dark:block">
        <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </svg>
      </div>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <Features />
        <Footer />
      </main>
    </div>
  );
}
