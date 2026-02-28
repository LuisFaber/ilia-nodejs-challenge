"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const cardKeys = ["secure", "control", "insights"] as const;

export function Features() {
  const { t } = useTranslation("landing");
  return (
    <section className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {t("features.title")}
        </motion.h2>
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {cardKeys.map((key, i) => (
            <motion.div
              key={key}
              className="rounded-2xl border border-neutral-200 bg-neutral-50/90 p-8 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{t(`features.cards.${key}.title`)}</h3>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t(`features.cards.${key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
