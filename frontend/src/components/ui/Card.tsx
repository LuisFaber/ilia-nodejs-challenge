"use client";

import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-neutral-800 bg-neutral-900 p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
