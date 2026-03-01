"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/context/AuthContext";

const NAV_LINKS = [
  { href: "/dashboard", labelKey: "dashboard" as const },
  { href: "/profile", labelKey: "profile" as const },
] as const;

export function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("common");

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-10 flex h-24 items-center justify-between border-b border-white/5 bg-[#000] px-6 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] backdrop-blur-sm transition-shadow"
      role="banner"
    >
      <Link
        href="/dashboard"
        className="transition-opacity hover:opacity-90"
        aria-label="WalletX home"
      >
        <Image
            src="/logo-walletx.png"
            alt="WalletX"
            width={112}
            height={112}
            className="h-12 w-auto min-w-[96px] shrink-0 object-contain sm:h-14 sm:min-w-[112px]"
          />
      </Link>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, labelKey }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard" || pathname?.startsWith("/dashboard/")
                : pathname === "/profile" || pathname?.startsWith("/profile/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t(labelKey)}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-px bg-white/80"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          aria-label={t("exit")}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30"
        >
          {t("exit")}
        </button>
      </div>
    </header>
  );
}
