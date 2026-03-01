"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { t } = useTranslation("wallet");

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </header>
      <section className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-2 text-sm font-medium text-neutral-400">{t("balance")}</h2>
        <p className="text-3xl font-bold text-white">R$ 0,00</p>
        <p className="mt-1 text-sm text-neutral-500">Mock — integração em breve</p>
      </section>
      <Button type="button" variant="primary">
        Adicionar Movimentação
      </Button>
    </div>
  );
}