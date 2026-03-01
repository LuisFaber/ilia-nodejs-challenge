"use client";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Header } from "@/features/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-wallet-bg">
        <Header />
        <main className="pt-0">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
