"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function HomeContent() {
  const { t } = useTranslation("common");
  const { t: tAuth } = useTranslation("auth");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">{t("appName")}</h1>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          {tAuth("login")}
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-2 font-medium text-white hover:bg-neutral-700"
        >
          {tAuth("register")}
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-2 font-medium text-white hover:bg-neutral-700"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
