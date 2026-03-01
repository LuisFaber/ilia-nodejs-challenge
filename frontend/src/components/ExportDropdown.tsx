"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TransactionItemData } from "./TransactionItem";
import { exportToCSV, exportToXLSX, type ExportLocale } from "@/lib/exportTransactions";

interface ExportDropdownProps {
  transactions: TransactionItemData[];
  className?: string;
}

const LOCALE_MAP: Record<string, ExportLocale> = {
  en: "en",
  "pt-BR": "pt-BR",
  pt: "pt-BR",
  es: "es",
};

export function ExportDropdown({
  transactions,
  className = "",
}: ExportDropdownProps) {
  const { t, i18n } = useTranslation("wallet");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const exportLocale: ExportLocale = LOCALE_MAP[i18n.language] ?? "en";
  const exportOptions = {
    columnDate: t("date"),
    columnDescription: t("description"),
    columnType: t("type"),
    columnAmount: t("amount"),
    sheetName: t("exportSheetName"),
    fileNameBase: t("exportFileName"),
    locale: exportLocale,
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCSV = () => {
    exportToCSV(transactions, exportOptions);
    setOpen(false);
  };

  const handleXLSX = async () => {
    await exportToXLSX(transactions, exportOptions);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-wallet-muted transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {t("export")}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border border-white/10 bg-wallet-surface py-1 shadow-lg">
          <button
            type="button"
            onClick={handleCSV}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-white transition-colors duration-200 hover:bg-white/5"
          >
            <span className="text-wallet-muted">CSV</span>
            {t("exportCSV")}
          </button>
          <button
            type="button"
            onClick={handleXLSX}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-white transition-colors duration-200 hover:bg-white/5"
          >
            <span className="text-wallet-muted">XLSX</span>
            {t("exportExcel")}
          </button>
        </div>
      )}
    </div>
  );
}
