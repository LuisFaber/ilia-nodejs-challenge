"use client";

import { type ReactNode } from "react";

type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  message: ReactNode;
  variant?: ToastVariant;
  onClose?: () => void;
};

const variantClasses: Record<ToastVariant, string> = {
  success: "bg-green-600/90 text-white",
  error: "bg-red-600/90 text-white",
  info: "bg-neutral-700 text-white",
};

export function Toast({ message, variant = "info", onClose }: ToastProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-md ${variantClasses[variant]}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm underline focus:outline-none"
            aria-label="Fechar"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
