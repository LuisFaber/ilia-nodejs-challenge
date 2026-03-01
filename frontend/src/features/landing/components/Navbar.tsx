"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Navbar() {
  const { t } = useTranslation("landing");
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="flex h-16 items-center justify-between border-b border-neutral-200 bg-transparent px-6 py-6 dark:border-neutral-800 md:px-8">
      <Link href="/" className="flex items-center hover:opacity-90">
        <Image src="/logo-walletx.png" alt={t("navbar.logoAlt")} width={160} height={40} className="h-8 w-auto invert dark:invert-0 md:h-10" priority />
      </Link>
      <div className="flex items-center gap-3">
        <button type="button" onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800" aria-label={theme === "dark" ? t("navbar.themeLight") : t("navbar.themeDark")}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <Link href="/auth/login" className="rounded-lg border border-neutral-900 px-6 py-3 font-medium text-neutral-900 transition-all duration-200 hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
          {t("navbar.ctaLogin")}
        </Link>
      </div>
    </nav>
  );
}
