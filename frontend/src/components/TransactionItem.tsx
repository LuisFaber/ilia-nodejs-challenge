"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export interface TransactionItemData {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  createdAt?: string;
}

interface TransactionItemProps {
  transaction: TransactionItemData;
  index: number;
}

function CreditIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wallet-credit/15 text-wallet-credit" aria-hidden>
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </span>
  );
}

function DebitIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wallet-debit/15 text-wallet-debit" aria-hidden>
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </span>
  );
}

export function TransactionItem({ transaction, index }: TransactionItemProps) {
  useTranslation("wallet");
  const isCredit = transaction.amount >= 0;
  const categoryLabel = transaction.category;

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.25 }}
      className="group flex items-center gap-4 rounded-lg border border-white/5 bg-zinc-900/50 px-4 py-5 transition-all duration-200 hover:bg-zinc-800/40"
    >
      <div className="shrink-0">
        {isCredit ? <CreditIcon /> : <DebitIcon />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-base text-white">{transaction.title}</p>
        <p className="mt-0.5 text-sm text-wallet-muted">{categoryLabel}</p>
        <p className="mt-1 text-xs text-wallet-muted">{transaction.date}</p>
      </div>
      <p
        className={`shrink-0 text-lg font-semibold tabular-nums ${
          isCredit ? "text-wallet-credit" : "text-wallet-debit"
        }`}
      >
        {isCredit ? "+" : ""}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(transaction.amount)}
      </p>
    </motion.li>
  );
}
