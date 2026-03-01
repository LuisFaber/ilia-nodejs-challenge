"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { AuthInput } from "./AuthInput";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { t } = useTranslation("auth");
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("loginError"));
    }
  };

  return (
    <>
      <motion.h1
        className="mb-6 text-3xl font-bold text-white"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {t("login")}
      </motion.h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <AuthInput
            label={t("email")}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...registerField("email")}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AuthInput
            label={t("password")}
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...registerField("password")}
          />
        </motion.div>
        {error && (
          <motion.p
            className="mb-4 text-sm text-red-400"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-2"
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white py-3 font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? t("loading", { ns: "common" }) : t("login")}
          </button>
        </motion.div>
      </form>
      <motion.p
        className="mt-8 text-center text-sm text-neutral-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {"Don't have an account? "}
        <Link
          href="/auth/register"
          className="text-white underline transition-opacity hover:no-underline hover:opacity-90"
        >
          {t("register")}
        </Link>
      </motion.p>
    </>
  );
}
