"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useAuth } from "@/features/auth/context/AuthContext";
import { authService } from "@/features/auth/services/auth.service";
import { Input } from "@/components/ui/Input";

const LANGUAGES = [
  { value: "en" as const, labelKey: "languageEn" as const },
  { value: "pt" as const, labelKey: "languagePt" as const },
  { value: "es" as const, labelKey: "languageEs" as const },
] as const;

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("profile");

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<"en" | "pt" | "es">("en");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setEmail(user.email ?? "");
      setLanguage(user.language ?? "en");
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setMessage(null);
    try {
      const payload: Parameters<typeof authService.updateUser>[1] = {
        first_name: first_name.trim() || undefined,
        last_name: last_name.trim() || undefined,
        email: email.trim() || undefined,
        language,
      };
      if (password.trim().length > 0) payload.password = password.trim();
      const updated = await authService.updateUser(user.id, payload);
      setUser(updated);
      setPassword("");
      if (updated.language) i18n.changeLanguage(updated.language === "pt" ? "pt-BR" : updated.language);
      setMessage({ type: "success", text: t("updateSuccess") });
    } catch (err) {
      setMessage({
        type: "error",
        text: (err instanceof Error ? err.message : undefined) ?? t("updateError"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (typeof window === "undefined" || !user?.id) return;
    if (!window.confirm(t("confirmDelete"))) return;
    setLoading(true);
    setMessage(null);
    try {
      await authService.deleteUser(user.id);
      await logout();
      router.replace("/");
    } catch (err) {
      setMessage({
        type: "error",
        text: (err instanceof Error ? err.message : undefined) ?? t("updateError"),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-md px-6 py-16"
    >
      <h1 className="mb-10 text-2xl font-semibold text-white">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t("firstName")}
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t("firstName")}
          className="border-white/10 bg-wallet-surface text-white placeholder-wallet-muted"
        />
        <Input
          label={t("lastName")}
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={t("lastName")}
          className="border-white/10 bg-wallet-surface text-white placeholder-wallet-muted"
        />
        <Input
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="border-white/10 bg-wallet-surface text-white placeholder-wallet-muted"
        />
        <Input
          label={t("newPassword")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          className="border-white/10 bg-wallet-surface text-white placeholder-wallet-muted"
        />

        <div className="w-full" ref={languageRef}>
          <label className="mb-1 block text-sm font-medium text-wallet-muted">{t("language")}</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-wallet-bg px-4 py-3 text-left text-white transition-all duration-200 hover:border-white/20 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10"
              aria-haspopup="listbox"
              aria-expanded={languageOpen}
            >
              <span>{t(LANGUAGES.find((l) => l.value === language)?.labelKey ?? "languageEn")}</span>
              <svg
                className={`h-4 w-4 shrink-0 text-wallet-muted transition-transform duration-200 ${languageOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute top-full left-0 right-0 z-10 mt-1 overflow-hidden rounded-lg border border-white/10 bg-wallet-surface py-1 shadow-lg"
                >
                  {LANGUAGES.map(({ value, labelKey }) => (
                    <li key={value} role="option" aria-selected={language === value}>
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage(value);
                          setLanguageOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          language === value
                            ? "bg-white/10 font-medium text-white"
                            : "text-wallet-muted hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {t(labelKey)}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-wallet-credit" : "text-wallet-debit"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-white py-3 text-sm font-medium text-wallet-bg transition-all duration-200 hover:bg-neutral-100 disabled:opacity-50"
          >
            {loading ? "..." : t("update")}
          </button>
        </div>
      </form>

      <div className="mt-16 border-t border-white/5 pt-10">
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={loading}
          className="rounded-lg border border-wallet-debit/50 px-4 py-3 text-sm font-medium text-wallet-debit transition-colors hover:bg-wallet-debit/10 disabled:opacity-50"
        >
          {t("deleteAccount")}
        </button>
      </div>
    </motion.main>
  );
}
