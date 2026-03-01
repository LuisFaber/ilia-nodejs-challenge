"use client";

import type { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export function Avatar({
  initials,
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-neutral-300 ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={initials ? `Avatar for ${initials}` : "User avatar"}
      {...props}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
