"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Filter,
  Loader2,
  PauseCircle,
  Pencil,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";
import {
  clientBillingMode,
  MANUAL_CARD_STATUS_LABELS,
  type ManualCardStatus,
} from "@/lib/billing";
import AdminAuditFeed, {
  type AdminAuditEntry,
} from "@/components/admin/AdminAuditFeed";

interface AdminCard {
  id: string;
  slug: string;
  fullName: string;
  jobTitle?: string | null;
  company?: string | null;
  manualStatus: ManualCardStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string | null;
  adminNoteUpdatedAt?: string | null;
  adminNoteUpdatedByUserId?: string | null;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  _count: {
    leads: number;
    views: number;
  };
}

const STATUS_META: Record<
  ManualCardStatus,
  { label: string; className: string; icon: typeof CheckCircle }
> = {
  pending: {
    label: MANUAL_CARD_STATUS_LABELS.pending,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    icon: AlertTriangle,
  },
  active: {
    label: MANUAL_CARD_STATUS_LABELS.active,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    icon: CheckCircle,
  },
  paused: {
    label: MANUAL_CARD_STATUS_LABELS.paused,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    icon: PauseCircle,
  },
};

const STATUS_OPTIONS: ManualCardStatus[] = ["pending", "active", "paused"];
const FILTER_OPTIONS: Array<{ value: "all" | ManualCardStatus; label: string }> =
  [
    { value: "all", label: "All statuses" },
    { value: "pending", label: MANUAL_CARD_STATUS_LABELS.pending },
    { value: "active", label: MANUAL_CARD_STATUS_LABELS.active },
    { value: "paused", label: MANUAL_CARD_STATUS_LABELS.paused },
  ];

interface OwnerGroup {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  total: number;
  pending: number;
  active: number;
  paused: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [recentAudit, setRecentAudit] = useState<AdminAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState<string | null>(null);
  const [bulkUpdatingUserId, setBulkUpdatingUserId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ManualCardStatus>(
    "all"
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [ownerNoteDrafts, setOwnerNoteDrafts] = useState<
    Record<string, string>
  >({});
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cards");

      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch admin cards");
      }

      const data = (await res.json()) as {
        cards: AdminCard[];
        recentAudit: AdminAuditEntry[];
      };
      setCards(data.cards || []);
      setRecentAudit(data.recentAudit || []);
      setNoteDrafts(
        Object.fromEntries(
          (data.cards || []).map((card) => [card.id, card.adminNote ?? ""])
        )
      );
      setOwnerNoteDrafts((current) => {
        const next = { ...current };

        for (const card of data.cards || []) {
          if (!(card.user.id in next)) {
            next[card.user.id] = "";
          }
        }

        return next;
      });
    } catch {
      alert("Failed to load admin activation queue");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/dashboard");
    }
  }, [router, session?.user?.isAdmin, status]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.isAdmin &&
      clientBillingMode === "manual"
    ) {
      void fetchCards();
    }
  }, [fetchCards, session?.user?.isAdmin, status]);

  const stats = useMemo(
    () => ({
      total: cards.length,
      pending: cards.filter((card) => card.manualStatus === "pending").length,
      active: cards.filter((card) => card.manualStatus === "active").length,
      paused: cards.filter((card) => card.manualStatus === "paused").length,
    }),
    [cards]
  );

  const filteredCards = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return cards.filter((card) => {
      if (statusFilter !== "all" && card.manualStatus !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        card.fullName,
        card.slug,
        card.jobTitle,
        card.company,
        card.user.name,
        card.user.email,
        card.adminNote,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [cards, deferredSearchQuery, statusFilter]);

  const ownerGroups = useMemo<OwnerGroup[]>(() => {
    const groups = new Map<string, OwnerGroup>();

    for (const card of filteredCards) {
      const existing = groups.get(card.user.id) ?? {
        userId: card.user.id,
        userName: card.user.name ?? null,
        userEmail: card.user.email ?? null,
        total: 0,
        pending: 0,
        active: 0,
        paused: 0,
      };

      existing.total += 1;
      existing[card.manualStatus] += 1;
      groups.set(card.user.id, existing);
    }

    return [...groups.values()].sort((left, right) => {
      if (left.pending !== right.pending) {
        return right.pending - left.pending;
      }

      if (left.total !== right.total) {
        return right.total - left.total;
      }

      return (left.userEmail ?? left.userName ?? "").localeCompare(
        right.userEmail ?? right.userName ?? ""
      );
    });
  }, [filteredCards]);

  function formatTimestamp(value?: string | null) {
    if (!value) return null;
    return new Date(value).toLocaleString();
  }

  async function updateStatus(cardId: string, nextStatus: ManualCardStatus) {
    setUpdating(cardId);

    try {
      const note = noteDrafts[cardId] ?? "";
      const res = await fetch(`/api/admin/cards/${cardId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus, note }),
      });

      if (!res.ok) {
        throw new Error("Failed to update card status");
      }

      await fetchCards();
    } catch {
      alert("Status update failed");
    } finally {
      setUpdating(null);
    }
  }

  async function saveNote(cardId: string) {
    setSavingNote(cardId);

    try {
      const note = noteDrafts[cardId] ?? "";
      const res = await fetch(`/api/admin/cards/${cardId}/note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });

      if (!res.ok) {
        throw new Error("Failed to save note");
      }

      await fetchCards();
    } catch {
      alert("Note save failed");
    } finally {
      setSavingNote(null);
    }
  }

  async function updateOwnerStatus(
    userId: string,
    nextStatus: ManualCardStatus
  ) {
    setBulkUpdatingUserId(userId);

    try {
      const ownerNote = ownerNoteDrafts[userId] ?? "";
      const applyNote = ownerNote.trim().length > 0;
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
          applyNote,
          note: applyNote ? ownerNote : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update this owner's cards");
      }

      if (applyNote) {
        setOwnerNoteDrafts((previous) => ({ ...previous, [userId]: "" }));
      }

      await fetchCards();
    } catch {
      alert("Bulk update failed");
    } finally {
      setBulkUpdatingUserId(null);
    }
  }

  const navItems = [
    { href: "/dashboard", label: "Cards", icon: CreditCard },
    { href: "/dashboard/leads", label: "Leads", icon: Users, hiddenUntil: "md" as const },
    { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck, active: true },
  ];

  if (status === "loading" || (loading && cards.length === 0)) {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="ADMIN ACTIVATION LAYER"
      title={
        <>
          Manual access, <span className="gradient-text">visually controlled</span>.
        </>
      }
      description="Review the approval queue, move cards between pending, active, and paused, annotate decisions, and keep owner-level activation under one clean operational surface."
      navItems={navItems}
      sessionLabel={session?.user?.name || session?.user?.email}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      heroActions={
        <>
          <Link href="/dashboard" className={shellStyles.actionButtonGhost}>
            <CreditCard className={shellStyles.buttonIcon} />
            Back to cards
          </Link>
          <Link href="/dashboard/leads" className={shellStyles.actionButtonGhost}>
            <Users className={shellStyles.buttonIcon} />
            Lead inbox
          </Link>
        </>
      }
      heroAside={
        <>
          <div className={`${shellStyles.spotlight} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>QUEUE SIGNAL</p>
            <h2 className={shellStyles.spotlightTitle}>
              {clientBillingMode !== "manual"
                ? "Manual activation is currently disabled."
                : `${stats.pending} card${stats.pending === 1 ? "" : "s"} waiting for review.`}
            </h2>
            <p className={shellStyles.spotlightText}>
              {clientBillingMode !== "manual"
                ? "This screen is only active while billing mode stays in manual. Once manual mode returns, approvals and pause controls will reappear instantly."
                : "Use owner-level actions for broad access changes, then drop to per-card notes and final status decisions where needed."}
            </p>
            <div className={shellStyles.spotlightBadges}>
              <span className={shellStyles.spotlightBadge}>
                <ShieldCheck className={shellStyles.spotlightBadgeIcon} />
                Manual billing
              </span>
              <span className={shellStyles.spotlightBadge}>
                <Workflow className={shellStyles.spotlightBadgeIcon} />
                Queue + audit
              </span>
            </div>
          </div>

          <div className={shellStyles.metricGrid}>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Owners in scope</span>
              <span className={shellStyles.metricTileValue}>{ownerGroups.length}</span>
            </div>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Recent events</span>
              <span className={shellStyles.metricTileValue}>{recentAudit.length}</span>
            </div>
          </div>
        </>
      }
      stats={[
        {
          label: "Total queue",
          value: stats.total,
          hint: "All cards currently visible to the admin queue.",
        },
        {
          label: "Pending",
          value: stats.pending,
          hint: "Cards awaiting manual activation.",
          tone: "amber",
        },
        {
          label: "Active",
          value: stats.active,
          hint: "Cards currently live in public view.",
          tone: "emerald",
        },
        {
          label: "Paused",
          value: stats.paused,
          hint: "Cards blocked until manual reactivation.",
          tone: "rose",
        },
      ]}
    >
      {clientBillingMode !== "manual" ? (
        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.emptyState}>
            <div className={shellStyles.emptyIconWrap}>
              <ShieldCheck className={shellStyles.emptyIcon} />
            </div>
            <h2 className={shellStyles.emptyTitle}>Admin activation is disabled</h2>
            <p className={shellStyles.emptyText}>
              This page only works while billing mode is set to manual.
            </p>
            <div className={`${shellStyles.buttonRow} mt-6 justify-center`}>
              <Link href="/dashboard" className={shellStyles.actionButton}>
                <CreditCard className={shellStyles.buttonIcon} />
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className={`${shellStyles.surfaceCard} glass-panel`}>
            <div className={shellStyles.surfaceHeader}>
              <div>
                <p className={`mono ${shellStyles.spotlightLabel}`}>FILTER + SEARCH</p>
                <h2 className={shellStyles.surfaceTitle}>Find cards or owners fast</h2>
                <p className={shellStyles.surfaceDescription}>
                  Search by owner, card slug, company, or note, then slice the queue by access state.
                </p>
              </div>

              <div className={shellStyles.pillRow}>
                <span className={shellStyles.pill}>
                  <Sparkles className={shellStyles.pillIcon} />
                  {filteredCards.length} visible records
                </span>
                <span className={shellStyles.pill}>
                  <Users className={shellStyles.pillIcon} />
                  {ownerGroups.length} owners
                </span>
              </div>
            </div>

            <div className={shellStyles.toolbar}>
              <label className={shellStyles.toolbarField}>
                <Search className={shellStyles.toolbarFieldIcon} />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by card, owner, slug, company, or note"
                  className={shellStyles.toolbarInput}
                />
              </label>

              <label className="relative min-w-[220px]">
                <Filter className={shellStyles.toolbarFieldIcon} />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | ManualCardStatus)
                  }
                  className={`${shellStyles.toolbarSelect} pl-11`}
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {(searchQuery || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className={shellStyles.actionButtonGhost}
                >
                  Reset filters
                </button>
              )}
            </div>

            <p className={`${shellStyles.toolbarHint} mt-4`}>
              Showing {filteredCards.length} of {cards.length} cards across {ownerGroups.length} owners.
            </p>
          </section>

          {ownerGroups.length > 0 && (
            <section className={`${shellStyles.surfaceCard} glass-panel`}>
              <div className={shellStyles.surfaceHeader}>
                <div>
                  <p className={`mono ${shellStyles.spotlightLabel}`}>OWNER CONTROLS</p>
                  <h2 className={shellStyles.surfaceTitle}>Bulk activation by owner</h2>
                  <p className={shellStyles.surfaceDescription}>
                    Push one decision across all cards for a single owner, with an optional shared internal note.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {ownerGroups.map((group) => (
                  <article
                    key={group.userId}
                    className={`${shellStyles.surfaceCard} glass-panel`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold">
                            {group.userName || group.userEmail || "Unknown owner"}
                          </h3>
                          <Link
                            href={`/dashboard/admin/owners/${group.userId}`}
                            className={shellStyles.actionButtonGhost}
                          >
                            Open owner detail
                          </Link>
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                          {group.userEmail}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className={shellStyles.badge}>{group.total} cards</span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${STATUS_META.pending.className}`}>
                            {group.pending} pending
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${STATUS_META.active.className}`}>
                            {group.active} active
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${STATUS_META.paused.className}`}>
                            {group.paused} paused
                          </span>
                        </div>
                      </div>

                      <div className="w-full lg:max-w-[360px]">
                        <label className={`mono ${shellStyles.spotlightLabel}`}>
                          OPTIONAL BULK NOTE
                        </label>
                        <textarea
                          rows={3}
                          value={ownerNoteDrafts[group.userId] ?? ""}
                          onChange={(event) =>
                            setOwnerNoteDrafts((previous) => ({
                              ...previous,
                              [group.userId]: event.target.value,
                            }))
                          }
                          placeholder="Apply the same note to all this owner's cards"
                          className={shellStyles.textarea}
                        />
                        <div className={`${shellStyles.buttonRow} mt-3`}>
                          {STATUS_OPTIONS.map((option) => {
                            const optionMeta = STATUS_META[option];
                            const OptionIcon = optionMeta.icon;
                            const isBusy = bulkUpdatingUserId === group.userId;

                            return (
                              <button
                                key={`${group.userId}-${option}`}
                                onClick={() =>
                                  void updateOwnerStatus(group.userId, option)
                                }
                                disabled={isBusy}
                                className={shellStyles.actionButtonGhost}
                              >
                                {isBusy ? (
                                  <Loader2 className={shellStyles.buttonIcon} />
                                ) : (
                                  <OptionIcon className={shellStyles.buttonIcon} />
                                )}
                                {optionMeta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <AdminAuditFeed
            entries={recentAudit}
            emptyText="Admin actions will appear here once you start approving, pausing, or annotating cards."
          />

          {cards.length === 0 ? (
            <section className={`${shellStyles.surfaceCard} glass-panel`}>
              <div className={shellStyles.emptyState}>
                <div className={shellStyles.emptyIconWrap}>
                  <ShieldCheck className={shellStyles.emptyIcon} />
                </div>
                <h2 className={shellStyles.emptyTitle}>No cards to review</h2>
                <p className={shellStyles.emptyText}>
                  As new cards are created in manual billing mode, they will appear here automatically.
                </p>
              </div>
            </section>
          ) : filteredCards.length === 0 ? (
            <section className={`${shellStyles.surfaceCard} glass-panel`}>
              <div className={shellStyles.emptyState}>
                <div className={shellStyles.emptyIconWrap}>
                  <Search className={shellStyles.emptyIcon} />
                </div>
                <h2 className={shellStyles.emptyTitle}>No cards match these filters</h2>
                <p className={shellStyles.emptyText}>
                  Change the search query or reset the status filter to see more records.
                </p>
              </div>
            </section>
          ) : (
            <section className={`${shellStyles.surfaceCard} glass-panel`}>
              <div className={shellStyles.surfaceHeader}>
                <div>
                  <p className={`mono ${shellStyles.spotlightLabel}`}>CARD QUEUE</p>
                  <h2 className={shellStyles.surfaceTitle}>Per-card decisions and notes</h2>
                  <p className={shellStyles.surfaceDescription}>
                    Refine status one card at a time, attach internal context, and jump straight to the public card or edit view.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {filteredCards.map((card) => {
                  const meta = STATUS_META[card.manualStatus];
                  const StatusIcon = meta.icon;

                  return (
                    <article
                      key={card.id}
                      className={`${shellStyles.surfaceCard} glass-panel`}
                    >
                      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-semibold tracking-tight">
                              {card.fullName}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${meta.className}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {meta.label}
                            </span>
                            {card.adminNote && (
                              <span className={shellStyles.badge}>Note attached</span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
                            <span>{card.jobTitle || "No job title"}</span>
                            <span>{card.company || "No company"}</span>
                            <span className="font-[family-name:var(--font-mono)]">
                              /{card.slug}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className={shellStyles.badge}>
                              <Users className={shellStyles.badgeIcon} />
                              {card._count.leads} leads
                            </span>
                            <span className={shellStyles.badge}>
                              <Sparkles className={shellStyles.badgeIcon} />
                              {card._count.views} views
                            </span>
                            <Link
                              href={`/dashboard/admin/owners/${card.user.id}`}
                              className={shellStyles.actionButtonGhost}
                            >
                              Owner: {card.user.name || card.user.email || "Unknown user"}
                            </Link>
                          </div>

                          <div className={`${shellStyles.buttonRow} mt-4`}>
                            <Link
                              href={`/card/${card.slug}`}
                              target="_blank"
                              className={shellStyles.actionButtonGhost}
                            >
                              <ExternalLink className={shellStyles.buttonIcon} />
                              Open public card
                            </Link>
                            <Link
                              href={`/dashboard/cards/${card.id}/edit`}
                              className={shellStyles.actionButtonGhost}
                            >
                              <Pencil className={shellStyles.buttonIcon} />
                              Edit card
                            </Link>
                            <Link
                              href={`/dashboard/admin/owners/${card.user.id}`}
                              className={shellStyles.actionButtonGhost}
                            >
                              <Users className={shellStyles.buttonIcon} />
                              Owner detail
                            </Link>
                          </div>

                          <div className="mt-5 rounded-[22px] border border-white/8 bg-[rgba(2,6,23,0.64)] p-4">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className={`mono ${shellStyles.spotlightLabel}`}>
                                ACTIVATION NOTE
                              </p>
                              {card.adminNoteUpdatedAt && (
                                <span className={shellStyles.toolbarHint}>
                                  Updated {formatTimestamp(card.adminNoteUpdatedAt)}
                                </span>
                              )}
                            </div>
                            <textarea
                              rows={3}
                              value={noteDrafts[card.id] ?? ""}
                              onChange={(event) =>
                                setNoteDrafts((previous) => ({
                                  ...previous,
                                  [card.id]: event.target.value,
                                }))
                              }
                              placeholder="Internal note for activation, pause reason, or owner context"
                              className={shellStyles.textarea}
                            />
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => void saveNote(card.id)}
                                disabled={
                                  savingNote === card.id ||
                                  (noteDrafts[card.id] ?? "") === (card.adminNote ?? "")
                                }
                                className={shellStyles.actionButtonGhost}
                              >
                                {savingNote === card.id ? (
                                  <Loader2 className={shellStyles.buttonIcon} />
                                ) : (
                                  <Save className={shellStyles.buttonIcon} />
                                )}
                                Save note
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="xl:w-[360px]">
                          <p className={`mono ${shellStyles.spotlightLabel}`}>
                            CHANGE ACCESS STATE
                          </p>
                          <div className={`${shellStyles.buttonRow} xl:flex-col`}>
                            {STATUS_OPTIONS.map((option) => {
                              const optionMeta = STATUS_META[option];
                              const OptionIcon = optionMeta.icon;
                              const isCurrent = option === card.manualStatus;
                              const isBusy = updating === card.id;

                              return (
                                <button
                                  key={option}
                                  onClick={() => void updateStatus(card.id, option)}
                                  disabled={isBusy || isCurrent}
                                  className={
                                    isCurrent
                                      ? `inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-2xl border text-sm font-medium ${optionMeta.className}`
                                      : shellStyles.actionButtonGhost
                                  }
                                >
                                  {isBusy ? (
                                    <Loader2 className={shellStyles.buttonIcon} />
                                  ) : (
                                    <OptionIcon className={shellStyles.buttonIcon} />
                                  )}
                                  {optionMeta.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </DashboardShell>
  );
}
