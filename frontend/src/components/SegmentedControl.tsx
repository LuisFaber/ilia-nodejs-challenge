"use client";

import { motion } from "framer-motion";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`flex rounded-lg border border-white/10 bg-wallet-bg p-1 ${className}`}
      role="tablist"
      aria-label="Transaction type"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-md py-2.5 text-sm transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-wallet-bg ${
              isActive ? "font-semibold text-white" : "font-medium text-wallet-muted"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="segmented-active"
                className="absolute inset-0 rounded-md bg-white/10 shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
