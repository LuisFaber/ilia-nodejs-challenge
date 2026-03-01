"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

const SUBTITLE = "Secure access to your financial orbit";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,1)_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <Link
        href="/"
        className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-white"
        aria-label="Voltar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <main className="flex min-h-screen items-center justify-center px-4 py-20 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-[0_0_60px_rgba(255,255,255,0.05)] backdrop-blur-xl md:p-10"
        >
          <div className="mb-10 text-center">
            <Image
              src="/logo-walletx.png"
              alt="WalletX"
              width={180}
              height={44}
              className="mx-auto h-14 w-auto mix-blend-screen md:h-16"
              priority
            />
            <p className="mt-2 text-sm text-neutral-500">{SUBTITLE}</p>
          </div>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
