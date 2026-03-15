"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Eye,
  ExternalLink,
  Pencil,
  Trash2,
  QrCode,
  LogOut,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Palette,
  UserPlus,
} from "lucide-react";

interface CardData {
  id: string;
  slug: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  active: boolean;
  createdAt: string;
  theme: string;
  accentColor: string;
  subscription?: {
    status: string;
    currentPeriodEnd?: string;
  };
  _count: { views: number };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCards();
    }
  }, [status]);

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/cards");
      const data = await res.json();
      setCards(data.cards || []);
    } catch {
      console.error("Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm("Вы уверены? Визитка будет удалена безвозвратно.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/cards/${id}`, { method: "DELETE" });
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Ошибка удаления");
    } finally {
      setDeleting(null);
    }
  };

  const activateCard = async (cardId: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Ошибка создания сессии оплаты");
    }
  };

  const getStatusBadge = (card: CardData) => {
    const sub = card.subscription;
    if (!sub || sub.status === "inactive" || sub.status === "pending") {
      return (
        <span className="flex items-center gap-1 text-xs font-[family-name:var(--font-geist-mono)] text-yellow-400">
          <AlertTriangle className="w-3 h-3" />
          Не оплачена
        </span>
      );
    }
    if (sub.status === "active") {
      return (
        <span className="flex items-center gap-1 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-neon)]">
          <CheckCircle className="w-3 h-3" />
          Активна
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-neon-danger)]">
        <XCircle className="w-3 h-3" />
        {sub.status === "past_due" ? "Просрочена" : "Отменена"}
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-neon)] animate-spin" />
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)] hidden md:flex"
            >
              <Users className="w-4 h-4" />
              Лиды
            </Link>
            <Link
              href="/dashboard/templates"
              className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)] hidden md:flex"
            >
              <Palette className="w-4 h-4" />
              Шаблоны
            </Link>
            <Link
              href="/dashboard/team"
              className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)] hidden md:flex"
            >
              <UserPlus className="w-4 h-4" />
              Команда
            </Link>
            <span className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)] hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon-danger)] transition-colors font-[family-name:var(--font-geist-mono)]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Мои визитки</h1>
            <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
              [SYS.CARDS] Управление вашими цифровыми визитками
            </p>
          </div>
          <Link
            href="/dashboard/cards/new"
            className="flex items-center gap-2 bg-[var(--color-neon)] text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all font-[family-name:var(--font-geist-mono)]"
          >
            <Plus className="w-4 h-4" />
            Новая визитка
          </Link>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <CreditCard className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">У вас пока нет визиток</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Создайте свою первую цифровую визитку за пару минут
            </p>
            <Link
              href="/dashboard/cards/new"
              className="inline-flex items-center gap-2 bg-[var(--color-neon)] text-black px-6 py-3 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all font-[family-name:var(--font-geist-mono)]"
            >
              <Plus className="w-4 h-4" />
              Создать визитку
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-neon)]/50 transition-all group"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: card.accentColor }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{card.fullName}</h3>
                      {card.jobTitle && (
                        <p className="text-sm text-[var(--color-neon)] font-[family-name:var(--font-geist-mono)]">
                          {card.jobTitle}
                        </p>
                      )}
                      {card.company && (
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {card.company}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(card)}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {card._count.views} просмотров
                    </span>
                    <span className="font-[family-name:var(--font-geist-mono)] text-xs">
                      /{card.slug}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/card/${card.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs bg-[var(--color-bg-base)] border border-[var(--color-border)] px-3 py-2 rounded-md hover:border-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Открыть
                    </Link>
                    <Link
                      href={`/dashboard/cards/${card.id}/edit`}
                      className="flex items-center gap-1 text-xs bg-[var(--color-bg-base)] border border-[var(--color-border)] px-3 py-2 rounded-md hover:border-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
                    >
                      <Pencil className="w-3 h-3" />
                      Редактировать
                    </Link>
                    <Link
                      href={`/card/${card.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs bg-[var(--color-bg-base)] border border-[var(--color-border)] px-3 py-2 rounded-md hover:border-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
                    >
                      <QrCode className="w-3 h-3" />
                    </Link>
                    {(!card.subscription ||
                      card.subscription.status !== "active") && (
                      <button
                        onClick={() => activateCard(card.id)}
                        className="flex items-center gap-1 text-xs bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/30 text-[var(--color-neon)] px-3 py-2 rounded-md hover:bg-[var(--color-neon)] hover:text-black transition-all font-[family-name:var(--font-geist-mono)]"
                      >
                        Оплатить $10/мес
                      </button>
                    )}
                    <button
                      onClick={() => deleteCard(card.id)}
                      disabled={deleting === card.id}
                      className="flex items-center gap-1 text-xs bg-[var(--color-bg-base)] border border-[var(--color-border)] px-3 py-2 rounded-md hover:border-[var(--color-neon-danger)] hover:text-[var(--color-neon-danger)] transition-colors ml-auto"
                    >
                      {deleting === card.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
