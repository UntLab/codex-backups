"use client";

import { useEffect, useState, use } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, LogOut, Loader2 } from "lucide-react";
import CardForm from "@/components/CardForm";

export default function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [card, setCard] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/cards/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setCard(data.card);
          setLoading(false);
        })
        .catch(() => {
          router.push("/dashboard");
        });
    }
  }, [status, id, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-neon)] animate-spin" />
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] cyber-grid">
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-neon)] rounded-md flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-geist-mono)]">
              Card<span className="text-[var(--color-neon)]">SaaS</span>
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon-danger)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <CardForm
          mode="edit"
          cardId={id}
          initialData={card as Record<string, string>}
        />
      </main>
    </div>
  );
}
