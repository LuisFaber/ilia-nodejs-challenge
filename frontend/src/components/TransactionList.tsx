"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { TransactionItemData } from "./TransactionItem";
import { TransactionItem } from "./TransactionItem";
import { ExportDropdown } from "./ExportDropdown";
import { groupTransactionsByDate } from "@/lib/groupTransactionsByDate";

interface TransactionListProps {
  transactions: TransactionItemData[];
}

const SECTION_KEYS = ["today", "yesterday", "thisMonth"] as const;

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { t, i18n } = useTranslation("wallet");
  const locale = i18n.language ?? "en";
  const grouped = groupTransactionsByDate(transactions, locale);
  let itemIndex = 0;

  const getSectionLabel = (label: string) =>
    SECTION_KEYS.includes(label as (typeof SECTION_KEYS)[number])
      ? t(label as (typeof SECTION_KEYS)[number])
      : capitalizeFirst(label);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mx-auto max-w-2xl px-6 pb-20"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-wide text-wallet-muted">
          {t("recentTransactions")}
        </h2>
        <ExportDropdown transactions={transactions} />
      </div>

      <div className="space-y-6 rounded-xl border border-white/5 bg-zinc-900/30 p-4">
        {grouped.length === 0 ? (
          <p className="py-8 text-center text-sm text-wallet-muted">
            {t("noTransactions")}
          </p>
        ) : (
          grouped.map(({ label, items }) => (
            <div key={label} className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-wallet-muted">
                {getSectionLabel(label)}
              </h3>
              <ul className="list-none space-y-2">
                {items.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    index={itemIndex++}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}
