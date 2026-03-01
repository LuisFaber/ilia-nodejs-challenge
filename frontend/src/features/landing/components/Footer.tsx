"use client";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation("landing");
  return (
    <footer className="pb-12 pt-16 text-center text-sm text-neutral-500 dark:text-neutral-600">
      {t("footer.copyright")}
    </footer>
  );
}
