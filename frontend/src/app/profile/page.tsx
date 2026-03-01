"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Input } from "@/components/ui/Input";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName([user.first_name, user.last_name].filter(Boolean).join(" ") || "");
      setEmail(user.email ?? "");
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Placeholder: no update API yet
      setMessage({ type: "success", text: "Profile update not implemented yet." });
    } catch {
      setMessage({ type: "error", text: "Failed to update." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setMessage({ type: "error", text: "Account deletion not implemented yet." });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-md px-6 py-16"
    >
      <h1 className="mb-10 text-2xl font-semibold text-white">Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border-white/10 bg-wallet-surface text-white placeholder-wallet-muted"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="border-white/10 bg-wallet-surface text-white placeholder-wallet-muted"
        />

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
            {loading ? "..." : "Atualizar"}
          </button>
        </div>
      </form>

      <div className="mt-16 border-t border-white/5 pt-10">
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="rounded-lg border border-wallet-debit/50 py-3 px-4 text-sm font-medium text-wallet-debit transition-colors hover:bg-wallet-debit/10"
        >
          Excluir conta
        </button>
      </div>
    </motion.main>
  );
}
