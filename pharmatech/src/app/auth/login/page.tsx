"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Activity, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "../actions";

function LoginForm() {
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    formData.set("redirect", redirectTo);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        <div className="glass-tech rounded-3xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-800">
                Pharma<span className="text-cyan-600">Tech</span>
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
            Xoş gəlmisiniz
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            Hesabınıza daxil olun
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="email@nümunə.az"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Şifrə
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="Şifrənizi daxil edin"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary px-6 py-3 text-sm disabled:opacity-50"
            >
              {loading ? "Gözləyin..." : "Daxil ol"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Hesabınız yoxdur?{" "}
            <Link
              href="/auth/register"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Qeydiyyatdan keçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yüklənir...</div>}>
      <LoginForm />
    </Suspense>
  );
}
