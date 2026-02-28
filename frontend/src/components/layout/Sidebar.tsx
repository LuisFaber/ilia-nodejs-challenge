"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-neutral-800 bg-black">
      <div className="flex h-full flex-col pt-6">
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white")
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
