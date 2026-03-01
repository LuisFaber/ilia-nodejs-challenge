"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { BalanceHero } from "@/components/BalanceHero";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import type { TransactionItemData } from "@/components/TransactionItem";
import { walletService } from "@/features/wallet/services/wallet.service";

function mapTransactionToItem(t: {
  id: string;
  amount: number;
  type: string;
  description?: string;
  createdAt: string;
}): TransactionItemData {
  const date = new Date(t.createdAt);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const signedAmount = t.type === "credit" ? t.amount : -t.amount;
  return {
    id: t.id,
    title: t.description?.trim() || "Transaction",
    category: t.type === "credit" ? "Income" : "Expense",
    amount: signedAmount,
    date: dateStr,
    createdAt: t.createdAt,
  };
}

export default function DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<TransactionItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [balanceRes, listRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
      ]);
      setBalance(balanceRes.amount);
      setTransactions(listRes.map(mapTransactionToItem));
    } catch {
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen"
    >
      <main>
        <BalanceHero
          balance={balance}
          onAddTransaction={() => setModalOpen(true)}
        />
        {loading ? (
          <div className="mx-auto max-w-2xl px-6 pb-20 text-center text-sm text-wallet-muted">
            Loading...
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </main>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
      />
    </motion.div>
  );
}
