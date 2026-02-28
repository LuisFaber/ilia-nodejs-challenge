"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <div className="pl-56">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
