"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";

export function TopBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName =
    user?.first_name?.trim() || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard");
  const isProfile = pathname === "/profile" || pathname?.startsWith("/profile");

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/5 px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo-walletx.png"
            alt="WalletX"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span
            className={`text-sm tracking-tight ${
              isDashboard ? "font-semibold text-white" : "font-medium text-wallet-muted"
            }`}
          >
            Dashboard
          </span>
        </Link>
        <Link
          href="/profile"
          className={`text-sm tracking-tight ${
            isProfile ? "font-semibold text-white" : "font-medium text-wallet-muted"
          } transition-colors hover:text-white`}
        >
          Perfil
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-sm text-wallet-muted transition-colors hover:text-white"
        >
          Perfil
        </Link>
        <span className="text-sm text-wallet-muted">{displayName}</span>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wallet-surface text-xs font-medium text-wallet-muted"
          aria-hidden
        >
          {initials}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-wallet-muted transition-colors hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
