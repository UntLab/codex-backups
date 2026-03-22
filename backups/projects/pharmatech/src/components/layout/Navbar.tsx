"use client";

import Link from "next/link";
import { Activity, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";

export function Navbar({ user }: { user?: { email: string } | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <nav className="fixed w-full z-50 top-0 p-4">
      <div className="max-w-7xl mx-auto glass-tech rounded-2xl px-6 md:px-8 py-4 flex justify-between items-center border border-white/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Pharma<span className="text-cyan-600">Tech</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-10 text-sm font-medium text-slate-500">
          <Link
            href="/catalog"
            className="hover:text-cyan-600 transition duration-300"
          >
            Kataloq
          </Link>
          <Link
            href="/#features"
            className="hover:text-cyan-600 transition duration-300"
          >
            Xidmətlər
          </Link>
          <Link
            href="/#delivery"
            className="hover:text-cyan-600 transition duration-300"
          >
            Çatdırılma
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 text-slate-500 hover:text-cyan-600 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems()}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href="/account"
              className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Hesabım</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="btn-secondary px-6 py-2.5 text-sm"
            >
              Giriş
            </Link>
          )}

          <button
            className="md:hidden p-2 text-slate-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-2 glass-tech rounded-2xl p-6 flex flex-col gap-4 text-sm font-medium text-slate-600">
          <Link href="/catalog" onClick={() => setMobileOpen(false)}>
            Kataloq
          </Link>
          <Link href="/#features" onClick={() => setMobileOpen(false)}>
            Xidmətlər
          </Link>
          <Link href="/#delivery" onClick={() => setMobileOpen(false)}>
            Çatdırılma
          </Link>
        </div>
      )}
    </nav>
  );
}
