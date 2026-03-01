"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const formatBalance = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function AnimatedBalance({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 25 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = formatBalance(v);
    });
    return () => unsub();
  }, [spring]);

  return <span ref={ref}>{formatBalance(0)}</span>;
}

export interface BalanceHeroProps {
  balance: number;
  onAddTransaction?: () => void;
}

export function BalanceHero({ balance, onAddTransaction }: BalanceHeroProps) {
  const { t } = useTranslation("wallet");
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mx-auto max-w-2xl px-6 py-24 text-center"
    >
      <p className="mb-2 text-sm font-medium tracking-wide text-wallet-muted">
        {t("availableBalance")}
      </p>
      <p
        className="mb-12 font-semibold tracking-[-0.02em] text-white tabular-nums"
        style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
      >
        <AnimatedBalance value={balance} />
      </p>
      <motion.button
        type="button"
        onClick={onAddTransaction}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-wallet-bg transition-all duration-200 hover:bg-neutral-100"
      >
        {t("addMovementButton")}
      </motion.button>
    </motion.section>
  );
}
