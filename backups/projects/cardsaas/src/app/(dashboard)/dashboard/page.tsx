"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Eye,
  Loader2,
  PauseCircle,
  Palette,
  Pencil,
  Plus,
  QrCode,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";
import {
  clientBillingMode,
  getManualCardStatus,
  MANUAL_CARD_STATUS_LABELS,
  type ManualCardStatus,
} from "@/lib/billing";

interface CardData {
  id: string;
  slug: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  active: boolean;
  createdAt: string;
  trialEndsAt?: string | null;
  theme: string;
  accentColor: string;
  manualStatus?: ManualCardStatus;
  subscription?: {
    status: string;
    currentPeriodEnd?: string;
  };
  _count: { views: number };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isManualMode = clientBillingMode === "manual";
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [quickUpdating, setQuickUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchCards();
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
    if (!confirm("Are you sure? This card will be permanently deleted.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/cards/${id}`, { method: "DELETE" });
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete card");
    } finally {
      setDeleting(null);
    }
  };

  const quickUpdateStatus = async (
    id: string,
    nextStatus: ManualCardStatus
  ) => {
    setQuickUpdating(id);

    try {
      const res = await fetch(`/api/admin/cards/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update card status");
      }

      await fetchCards();
    } catch {
      alert("Quick status update failed");
    } finally {
      setQuickUpdating(null);
    }
  };

  const getTrialEndDate = (card: CardData) => {
    if (card.trialEndsAt) return new Date(card.trialEndsAt);
    const fallback = new Date(card.createdAt);
    fallback.setDate(fallback.getDate() + 14);
    return fallback;
  };

  const getTrialDaysLeft = (card: CardData) => {
    const trialEnd = getTrialEndDate(card).getTime();
    const now = Date.now();
    const diff = trialEnd - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getResolvedManualStatus = (card: CardData) =>
    card.manualStatus ?? getManualCardStatus(card);

  const getStatusBadge = (card: CardData) => {
    if (isManualMode) {
      const manualStatus = getResolvedManualStatus(card);

      if (manualStatus === "active") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 font-[family-name:var(--font-mono)]">
            <CheckCircle className="w-3.5 h-3.5" />
            {MANUAL_CARD_STATUS_LABELS.active}
          </span>
        );
      }

      if (manualStatus === "paused") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 font-[family-name:var(--font-mono)]">
            <XCircle className="w-3.5 h-3.5" />
            {MANUAL_CARD_STATUS_LABELS.paused}
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 font-[family-name:var(--font-mono)]">
          <AlertTriangle className="w-3.5 h-3.5" />
          {MANUAL_CARD_STATUS_LABELS.pending}
        </span>
      );
    }

    const sub = card.subscription;
    if (sub?.status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 font-[family-name:var(--font-mono)]">
          <CheckCircle className="w-3.5 h-3.5" />
          Active
        </span>
      );
    }

    const trialDaysLeft = getTrialDaysLeft(card);

    if (trialDaysLeft > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 font-[family-name:var(--font-mono)]">
          <AlertTriangle className="w-3.5 h-3.5" />
          Trial: {trialDaysLeft}d left
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 font-[family-name:var(--font-mono)]">
        <XCircle className="w-3.5 h-3.5" />
        Billing paused
      </span>
    );
  };

  const totalViews = useMemo(
    () => cards.reduce((sum, card) => sum + card._count.views, 0),
    [cards]
  );

  const liveCards = useMemo(() => {
    if (isManualMode) {
      return cards.filter((card) => getResolvedManualStatus(card) === "active")
        .length;
    }

    return cards.filter((card) => card.subscription?.status === "active").length;
  }, [cards, isManualMode]);

  const pendingCards = useMemo(() => {
    if (isManualMode) {
      return cards.filter((card) => getResolvedManualStatus(card) === "pending")
        .length;
    }

    return cards.filter((card) => {
      if (card.subscription?.status === "active") return false;
      const trialEnd = card.trialEndsAt
        ? new Date(card.trialEndsAt)
        : (() => {
            const fallback = new Date(card.createdAt);
            fallback.setDate(fallback.getDate() + 14);
            return fallback;
          })();
      const diff = trialEnd.getTime() - Date.now();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))) > 0;
    }).length;
  }, [cards, isManualMode]);

  const pausedCards = useMemo(() => {
    if (isManualMode) {
      return cards.filter((card) => getResolvedManualStatus(card) === "paused")
        .length;
    }

    return cards.filter((card) => {
      if (card.subscription?.status === "active") return false;
      const trialEnd = card.trialEndsAt
        ? new Date(card.trialEndsAt)
        : (() => {
            const fallback = new Date(card.createdAt);
            fallback.setDate(fallback.getDate() + 14);
            return fallback;
          })();
      const diff = trialEnd.getTime() - Date.now();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))) === 0;
    }).length;
  }, [cards, isManualMode]);

  if (status === "loading" || loading) {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="WORKSPACE OVERVIEW"
      title={
        <>
          Your cards, <span className="gradient-text">ready to ship</span>.
        </>
      }
      description="Launch premium identity cards, keep approval state visible, and move between edits, templates, leads, and public sharing without dropping out of the product rhythm."
      navItems={[
        { href: "/dashboard", label: "Cards", icon: CreditCard, active: true },
        {
          href: "/dashboard/leads",
          label: "Leads",
          icon: Users,
          hiddenUntil: "md",
        },
        {
          href: "/dashboard/templates",
          label: "Templates",
          icon: Palette,
          hiddenUntil: "md",
        },
        {
          href: "/dashboard/team",
          label: "Team",
          icon: UserPlus,
          hiddenUntil: "lg",
        },
        ...(session?.user?.isAdmin
          ? [
              {
                href: "/dashboard/admin",
                label: "Admin",
                icon: ShieldCheck,
                hiddenUntil: "lg" as const,
              },
            ]
          : []),
      ]}
      sessionLabel={session?.user?.name || session?.user?.email}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      heroActions={
        <>
          <Link href="/dashboard/cards/new" className={shellStyles.actionButton}>
            <Plus className={shellStyles.buttonIcon} />
            New Card
          </Link>
          <Link
            href="/dashboard/leads"
            className={shellStyles.actionButtonGhost}
          >
            <Users className={shellStyles.buttonIcon} />
            Open Leads
          </Link>
        </>
      }
      heroAside={
        <>
          <div className={`${shellStyles.spotlight} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>WORKSPACE SIGNAL</p>
            <h2 className={shellStyles.spotlightTitle}>
              {cards.length === 0
                ? "Start by generating your first live identity card."
                : `${liveCards} card${liveCards === 1 ? "" : "s"} live right now.`}
            </h2>
            <p className={shellStyles.spotlightText}>
              {isManualMode
                ? "Manual activation is enabled, so every card clearly shows whether it is pending, active, or paused before anyone sees it publicly."
                : "Billing mode is active, so trial and subscription state stay attached to each card while you manage edits and launches."}
            </p>
            <div className={shellStyles.spotlightBadges}>
              <span className={shellStyles.spotlightBadge}>
                <ShieldCheck className={shellStyles.spotlightBadgeIcon} />
                {isManualMode ? "Manual approval" : "Subscription mode"}
              </span>
              <span className={shellStyles.spotlightBadge}>
                <Workflow className={shellStyles.spotlightBadgeIcon} />
                Public share flow
              </span>
            </div>
          </div>

          <div className={shellStyles.metricGrid}>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Views captured</span>
              <span className={shellStyles.metricTileValue}>{totalViews}</span>
            </div>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Paused / blocked</span>
              <span className={shellStyles.metricTileValue}>{pausedCards}</span>
            </div>
          </div>
        </>
      }
      stats={[
        {
          label: "Cards",
          value: cards.length,
          hint: "Total identity cards currently managed in this workspace.",
        },
        {
          label: "Live",
          value: liveCards,
          hint: "Cards currently available to the public.",
          tone: "emerald",
        },
        {
          label: "Pending",
          value: pendingCards,
          hint: isManualMode
            ? "Cards waiting for manual activation."
            : "Cards still in trial or not yet activated.",
          tone: "amber",
        },
        {
          label: "Views",
          value: totalViews,
          hint: "Combined public traffic across your cards.",
          tone: "violet",
        },
      ]}
    >
      {cards.length === 0 ? (
        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.emptyState}>
            <div className={shellStyles.emptyIconWrap}>
              <CreditCard className={shellStyles.emptyIcon} />
            </div>
            <h2 className={shellStyles.emptyTitle}>No cards yet</h2>
            <p className={shellStyles.emptyText}>
              Create your first digital business card and the workspace will
              instantly start tracking views, status, and launch readiness.
            </p>
            <div className={`${shellStyles.buttonRow} mt-6 justify-center`}>
              <Link
                href="/dashboard/cards/new"
                className={shellStyles.actionButton}
              >
                <Plus className={shellStyles.buttonIcon} />
                Create Card
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.surfaceHeader}>
            <div>
              <p className={`mono ${shellStyles.spotlightLabel}`}>CARD INVENTORY</p>
              <h2 className={shellStyles.surfaceTitle}>Published and in-progress cards</h2>
              <p className={shellStyles.surfaceDescription}>
                Each card keeps its own public route, theme configuration,
                approval state, and editing controls.
              </p>
            </div>

            <div className={shellStyles.pillRow}>
              <span className={shellStyles.pill}>
                <Eye className={shellStyles.pillIcon} />
                {totalViews} total views
              </span>
              <span className={shellStyles.pill}>
                <ShieldCheck className={shellStyles.pillIcon} />
                {isManualMode ? "Manual approvals" : "Billing tracked"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {cards.map((card) => {
              const resolvedStatus = isManualMode
                ? getResolvedManualStatus(card)
                : null;

              return (
                <article
                  key={card.id}
                  className={`${shellStyles.surfaceCard} glass-panel`}
                >
                  <div
                    className="h-1.5 rounded-full mb-5"
                    style={{ backgroundColor: card.accentColor }}
                  />

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-semibold tracking-tight">
                          {card.fullName}
                        </h3>
                        {getStatusBadge(card)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
                        <span>{card.jobTitle || "No job title yet"}</span>
                        <span>{card.company || "No company yet"}</span>
                        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em]">
                          Theme: {card.theme}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className={shellStyles.badge}>
                          <Eye className={shellStyles.badgeIcon} />
                          {card._count.views} views
                        </span>
                        <span className={shellStyles.badge}>
                          <QrCode className={shellStyles.badgeIcon} />
                          /{card.slug}
                        </span>
                      </div>
                    </div>

                    <div className={`${shellStyles.buttonRow} lg:justify-end`}>
                      <Link
                        href={`/card/${card.slug}`}
                        target="_blank"
                        className={shellStyles.actionButtonGhost}
                      >
                        <ExternalLink className={shellStyles.buttonIcon} />
                        Open
                      </Link>
                      <Link
                        href={`/dashboard/cards/${card.id}/edit`}
                        className={shellStyles.actionButtonGhost}
                      >
                        <Pencil className={shellStyles.buttonIcon} />
                        Edit
                      </Link>
                      {(!isManualMode &&
                        (!card.subscription ||
                          card.subscription.status !== "active")) && (
                        <Link
                          href="/dashboard/billing"
                          className={shellStyles.actionButton}
                        >
                          Billing
                        </Link>
                      )}
                      {isManualMode && session?.user?.isAdmin ? (
                        resolvedStatus === "active" ? (
                          <button
                            onClick={() => void quickUpdateStatus(card.id, "paused")}
                            disabled={quickUpdating === card.id}
                            className={shellStyles.actionButtonGhost}
                          >
                            {quickUpdating === card.id ? (
                              <Loader2 className={shellStyles.buttonIcon} />
                            ) : (
                              <PauseCircle className={shellStyles.buttonIcon} />
                            )}
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => void quickUpdateStatus(card.id, "active")}
                            disabled={quickUpdating === card.id}
                            className={shellStyles.actionButton}
                          >
                            {quickUpdating === card.id ? (
                              <Loader2 className={shellStyles.buttonIcon} />
                            ) : (
                              <CheckCircle className={shellStyles.buttonIcon} />
                            )}
                            {resolvedStatus === "paused"
                              ? "Reactivate"
                              : "Activate"}
                          </button>
                        )
                      ) : null}
                      {isManualMode &&
                      !session?.user?.isAdmin &&
                      resolvedStatus !== "active" ? (
                        <button
                          type="button"
                          disabled
                          className={`${shellStyles.actionButtonGhost} cursor-default opacity-75`}
                        >
                          {resolvedStatus === "paused"
                            ? "View status"
                            : "Pending review"}
                        </button>
                      ) : null}
                      {isManualMode && session?.user?.isAdmin && (
                        <Link
                          href="/dashboard/admin"
                          className={shellStyles.actionButtonGhost}
                        >
                          <ShieldCheck className={shellStyles.buttonIcon} />
                          Queue
                        </Link>
                      )}
                      <button
                        onClick={() => void deleteCard(card.id)}
                        disabled={deleting === card.id}
                        className={shellStyles.actionButtonDanger}
                      >
                        {deleting === card.id ? (
                          <Loader2 className={shellStyles.buttonIcon} />
                        ) : (
                          <Trash2 className={shellStyles.buttonIcon} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>

                  {isManualMode && (
                    <p className="mt-5 text-sm text-[var(--color-text-muted)] leading-7">
                      {resolvedStatus === "active"
                        ? "This card is live and publicly accessible."
                        : resolvedStatus === "paused"
                          ? "This card is currently hidden until you manually reactivate it."
                          : "This card is waiting for manual approval before it goes live."}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
