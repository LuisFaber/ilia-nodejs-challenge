"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { walletService } from "@/features/wallet/services/wallet.service";
import { SegmentedControl } from "@/components/SegmentedControl";

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TransactionType = "credit" | "debit";

export function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const { t } = useTranslation(["wallet", "common"]);
  const typeOptions = [
    { value: "credit" as const, label: t("credit") },
    { value: "debit" as const, label: t("debit") },
  ];
  const [type, setType] = useState<TransactionType>("credit");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setType("credit");
    setDescription("");
    setAmount("");
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleConfirm = async () => {
    const desc = description.trim();
    const amountNum = Math.abs(Number(amount.replace(/,/g, ".")));

    if (!amountNum || amountNum <= 0) {
      setError(t("errorAmountInvalid"));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await walletService.createTransaction({
        amount: Math.round(amountNum),
        type,
        description: desc || undefined,
      });
      reset();
      onClose();
      onSuccess();
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      const isInsufficientBalance =
        message.toLowerCase().includes("insufficient balance");
      setError(
        isInsufficientBalance ? t("insufficientBalance") : message || t("errorCreateFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  const isCredit = type === "credit";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-transaction-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            onKeyDown={(e) => e.key === "Escape" && handleClose()}
            tabIndex={0}
            aria-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-wallet-surface p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8">
              <h2
                id="add-transaction-title"
                className="text-xl font-semibold tracking-tight text-white"
              >
                {t("addMovement")}
              </h2>
              <p className="mt-1.5 text-sm text-wallet-muted">
                {t("addMovementSubtitle")}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-wallet-muted">
                  {t("type")}
                </label>
                <SegmentedControl
                  options={typeOptions}
                  value={type}
                  onChange={setType}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="modal-description"
                  className="block text-sm font-medium text-wallet-muted"
                >
                  {t("description")}
                </label>
                <input
                  id="modal-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  className="w-full cursor-text rounded-lg border border-white/10 bg-wallet-bg px-4 py-3 text-white placeholder-wallet-muted transition-all duration-200 hover:border-white/20 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="modal-amount"
                  className="block text-sm font-medium text-wallet-muted"
                >
                  {t("amount")}
                </label>
                <div className="flex cursor-text items-center overflow-hidden rounded-lg border border-white/10 bg-wallet-bg transition-all duration-200 hover:border-white/20 focus-within:border-white/25 focus-within:ring-2 focus-within:ring-white/10">
                  <span className="pl-4 text-sm text-wallet-muted">$</span>
                  <input
                    id="modal-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9,.]/g, "").replace(",", ".");
                      setAmount(v);
                    }}
                    placeholder={t("amountPlaceholder")}
                    className="w-full flex-1 bg-transparent py-3 pr-4 text-right text-white placeholder-wallet-muted focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-5 text-sm text-wallet-debit">{error}</p>
            )}

            <div className="mt-10 flex gap-3">
              <motion.button
                type="button"
                onClick={handleClose}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex-1 cursor-pointer rounded-lg border border-white/10 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/5 hover:border-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("cancel", { ns: "common" })}
              </motion.button>
              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`flex-1 cursor-pointer rounded-lg py-3 text-sm font-medium text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isCredit
                    ? "bg-wallet-credit hover:brightness-95"
                    : "bg-wallet-debit hover:brightness-95"
                }`}
              >
                {loading ? "..." : t("confirm")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
