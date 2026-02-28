"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation("landing");
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 md:px-12 md:py-32">
      <motion.div className="flex max-w-4xl flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <motion.h1 className="text-5xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white md:text-7xl" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          {t("hero.title")}
        </motion.h1>
        <motion.p className="mt-8 max-w-2xl text-center text-lg text-neutral-500 dark:text-neutral-400 md:text-xl" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
          {t("hero.subtitle")}
        </motion.p>
        <motion.div className="mt-14 flex flex-col justify-center gap-4 sm:flex-row" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <Link href="/auth/login" className="rounded-lg bg-neutral-900 px-8 py-4 font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:bg-neutral-800 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:bg-white dark:text-black dark:hover:bg-neutral-100 dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            {t("hero.ctaLogin")}
          </Link>
          <Link href="/auth/register" className="rounded-lg border border-neutral-900 px-8 py-4 font-medium text-neutral-900 transition-all duration-300 ease-out hover:scale-105 hover:bg-neutral-900 hover:text-white hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            {t("hero.ctaRegister")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
