"use client";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-neutral-400 ${className}`}
      role="status"
      aria-label="Carregando"
    />
  );
}
