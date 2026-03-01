"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800 bg-black px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400">
          {user ? `${user.first_name} ${user.last_name}` : ""}
        </span>
        <Button variant="secondary" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
