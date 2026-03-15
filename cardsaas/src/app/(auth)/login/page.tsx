"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Неверный email или пароль");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center px-4 cyber-grid">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[var(--color-neon)] opacity-[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[var(--color-neon)] rounded-md flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-geist-mono)]">
              Card<span className="text-[var(--color-neon)]">SaaS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Вход в систему</h1>
          <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
            [AUTH.LOGIN] Введите данные для авторизации
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8"
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-neon-danger)]/10 border border-[var(--color-neon-danger)]/30 text-sm text-[var(--color-neon-danger)] font-[family-name:var(--font-geist-mono)]">
              [ERROR] {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs text-[var(--color-text-muted)] mb-2 font-[family-name:var(--font-geist-mono)] uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)] text-white font-[family-name:var(--font-geist-mono)] text-sm focus:border-[var(--color-neon)] focus:shadow-[0_0_10px_rgba(0,255,204,0.2)] outline-none transition-all placeholder:text-[var(--color-text-muted)]/50"
              placeholder="user@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs text-[var(--color-text-muted)] mb-2 font-[family-name:var(--font-geist-mono)] uppercase">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)] text-white font-[family-name:var(--font-geist-mono)] text-sm focus:border-[var(--color-neon)] focus:shadow-[0_0_10px_rgba(0,255,204,0.2)] outline-none transition-all placeholder:text-[var(--color-text-muted)]/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-neon)] text-black py-3 rounded-lg font-bold hover:shadow-[0_0_25px_rgba(0,255,204,0.4)] transition-all font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? "Авторизация..." : "Войти"}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="text-[var(--color-neon)] hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
