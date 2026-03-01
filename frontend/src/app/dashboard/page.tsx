"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { BalanceHero } from "@/components/BalanceHero";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { Spinner } from "@/components/ui/Spinner";
import type { TransactionItemData } from "@/components/TransactionItem";
import { walletService } from "@/features/wallet/services/wallet.service";

const PAGE_SIZE = 8;

const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
};

export default function DashboardPage() {
  const { t, i18n } = useTranslation("wallet");
  const locale = LOCALE_MAP[i18n.language] ?? "en-US";
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  const mapTransactionToItem = useCallback(
    (tx: {
      id: string;
      amount: number;
      type: string;
      description?: string;
      createdAt: string;
    }): TransactionItemData => {
      const signedAmount = tx.type === "credit" ? tx.amount : -tx.amount;
      return {
        id: tx.id,
        title: tx.description?.trim() || t("transactionFallback"),
        category: tx.type === "credit" ? t("income") : t("expense"),
        amount: signedAmount,
        date: new Date(tx.createdAt).toLocaleDateString(locale, {
          month: "short",
          day: "numeric",
        }),
        createdAt: tx.createdAt,
      };
    },
    [t, locale]
  );

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: () => walletService.getBalance(),
  });

  const {
    data: txData,
    fetchNextPage,
    hasNextPage,
    isLoading: txLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: ({ pageParam }) =>
      walletService.getTransactions({ page: pageParam as number, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const loading = balanceLoading || txLoading;
  const balance = balanceData?.amount ?? 0;
  const transactions = txData?.pages.flatMap((p) =>
    p.items.map(mapTransactionToItem)
  ) ?? [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = loadMoreSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { root: null, rootMargin: "100px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["balance"] });
  }, [queryClient]);

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
          <div className="flex min-h-[280px] items-center justify-center">
            <Spinner className="h-10 w-10 border-t-white" />
          </div>
        ) : (
          <>
            <TransactionList transactions={transactions} />
            {hasNextPage && (
              <div
                ref={loadMoreSentinelRef}
                className="mx-auto flex max-w-2xl justify-center px-6 py-4 pb-20"
                aria-hidden
              >
                {isFetchingNextPage ? (
                  <Spinner className="h-8 w-8 border-t-white" />
                ) : (
                  <div className="h-1 w-full" />
                )}
              </div>
            )}
          </>
        )}
      </main>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onSuccess}
      />
    </motion.div>
  );
}
