"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ label, error, className = "", id, ...props }, ref) {
    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\s/g, "-") : undefined);
    return (
      <div className="mb-6 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-neutral-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={
            "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 transition-all duration-200 hover:border-neutral-600 focus:border-white focus:outline-none focus:ring-0 " +
            className
          }
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
