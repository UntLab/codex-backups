"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Loader2,
  PauseCircle,
  Pencil,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";
import AdminAuditFeed, {
  type AdminAuditEntry,
} from "@/components/admin/AdminAuditFeed";
import {
  clientBillingMode,
  MANUAL_CARD_STATUS_LABELS,
  type ManualCardStatus,
} from "@/lib/billing";

interface OwnerCard {
  id: string;
  slug: string;
  fullName: string;
  jobTitle?: string | null;
  company?: string | null;
  manualStatus: ManualCardStatus;
  updatedAt: string;
  adminNote?: string | null;
  adminNoteUpdatedAt?: string | null;
  _count: {
    leads: number;
    views: number;
  };
}

interface OwnerDetailData {
  user: {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    createdAt: string;
    _count: {
      cards: number;
      leads: number;
    };
  };
  summary: {
    total: number;
    pending: number;
    active: number;
    paused: number;
  };
  cards: OwnerCard[];
  audit: AdminAuditEntry[];
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

export default function OwnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<OwnerDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkNote, setBulkNote] = useState("");

  const fetchOwnerDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${id}`);

      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }

      if (res.status === 404) {
        router.push("/dashboard/admin");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load owner detail");
      }

      const nextData = (await res.json()) as OwnerDetailData;
      setData(nextData);
    } catch {
      alert("Failed to load owner detail");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

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
      void fetchOwnerDetail();
    }
  }, [fetchOwnerDetail, session?.user?.isAdmin, status]);

  const cards = useMemo(() => data?.cards ?? [], [data?.cards]);

  async function updateOwnerStatus(nextStatus: ManualCardStatus) {
    setBulkUpdating(true);

    try {
      const applyNote = bulkNote.trim().length > 0;
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
          applyNote,
          note: applyNote ? bulkNote : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Bulk update failed");
      }

      setBulkNote("");
      await fetchOwnerDetail();
    } catch {
      alert("Bulk update failed");
    } finally {
      setBulkUpdating(false);
    }
  }

  function formatTimestamp(value?: string | null) {
    if (!value) return null;
    return new Date(value).toLocaleString();
  }

  if (status === "loading" || loading || !data) {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="OWNER DETAIL"
      title={
        <>
          {data.user.name || data.user.email},{" "}
          <span className="gradient-text">fully in focus</span>.
        </>
      }
      description={`Review this owner's card portfolio, update access states in bulk, and trace their admin history without leaving the main operational surface.`}
      navItems={[
        { href: "/dashboard", label: "Cards", icon: CreditCard },
        { href: "/dashboard/leads", label: "Leads", icon: Users, hiddenUntil: "md" },
        { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck, active: true },
      ]}
      sessionLabel={session?.user?.name || session?.user?.email}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      heroActions={
        <>
          <Link href="/dashboard/admin" className={shellStyles.actionButtonGhost}>
            <ShieldCheck className={shellStyles.buttonIcon} />
            Back to admin
          </Link>
        </>
      }
      heroAside={
        <>
          <div className={`${shellStyles.spotlight} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>OWNER SIGNAL</p>
            <h2 className={shellStyles.spotlightTitle}>
              {data.summary.pending} pending, {data.summary.active} active, {data.summary.paused} paused.
            </h2>
            <p className={shellStyles.spotlightText}>
              {data.user.email} joined on {formatTimestamp(data.user.createdAt)} and currently has {data.user._count.cards} card{data.user._count.cards === 1 ? "" : "s"} inside the workspace.
            </p>
            <div className={shellStyles.spotlightBadges}>
              <span className={shellStyles.spotlightBadge}>
                <Users className={shellStyles.spotlightBadgeIcon} />
                {data.user._count.leads} leads captured
              </span>
              <span className={shellStyles.spotlightBadge}>
                <Workflow className={shellStyles.spotlightBadgeIcon} />
                Role: {data.user.role.toLowerCase()}
              </span>
            </div>
          </div>

          <div className={shellStyles.metricGrid}>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Cards</span>
              <span className={shellStyles.metricTileValue}>{data.summary.total}</span>
            </div>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Audit events</span>
              <span className={shellStyles.metricTileValue}>{data.audit.length}</span>
            </div>
          </div>
        </>
      }
      stats={[
        {
          label: "Cards",
          value: data.summary.total,
          hint: "All cards owned by this user.",
        },
        {
          label: "Pending",
          value: data.summary.pending,
          hint: "Cards still waiting for manual approval.",
          tone: "amber",
        },
        {
          label: "Active",
          value: data.summary.active,
          hint: "Cards currently visible to the public.",
          tone: "emerald",
        },
        {
          label: "Leads",
          value: data.user._count.leads,
          hint: "Total leads captured across this owner's cards.",
          tone: "violet",
        },
      ]}
    >
      <section className={`${shellStyles.surfaceCard} glass-panel`}>
        <div className={shellStyles.surfaceHeader}>
          <div>
            <p className={`mono ${shellStyles.spotlightLabel}`}>BULK OWNER ACTIONS</p>
            <h2 className={shellStyles.surfaceTitle}>Update all cards in one move</h2>
            <p className={shellStyles.surfaceDescription}>
              Apply one status across the full portfolio and optionally attach a shared note.
            </p>
          </div>

          <div className={shellStyles.pillRow}>
            <span className={shellStyles.pill}>
              <ShieldCheck className={shellStyles.pillIcon} />
              Manual activation mode
            </span>
          </div>
        </div>

        <textarea
          rows={3}
          value={bulkNote}
          onChange={(event) => setBulkNote(event.target.value)}
          placeholder="Optional note for all this owner's cards"
          className={shellStyles.textarea}
        />

        <div className={`${shellStyles.buttonRow} mt-4`}>
          {STATUS_OPTIONS.map((option) => {
            const optionMeta = STATUS_META[option];
            const OptionIcon = optionMeta.icon;

            return (
              <button
                key={option}
                onClick={() => void updateOwnerStatus(option)}
                disabled={bulkUpdating}
                className={shellStyles.actionButtonGhost}
              >
                {bulkUpdating ? (
                  <Loader2 className={shellStyles.buttonIcon} />
                ) : (
                  <OptionIcon className={shellStyles.buttonIcon} />
                )}
                {optionMeta.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className={`${shellStyles.surfaceCard} glass-panel`}>
        <div className={shellStyles.surfaceHeader}>
          <div>
            <p className={`mono ${shellStyles.spotlightLabel}`}>OWNER CARDS</p>
            <h2 className={shellStyles.surfaceTitle}>Current access state by card</h2>
            <p className={shellStyles.surfaceDescription}>
              Open public routes, jump into editing, and review any internal activation notes already attached to each card.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {cards.map((card) => {
            const meta = STATUS_META[card.manualStatus];
            const StatusIcon = meta.icon;

            return (
              <article
                key={card.id}
                className={`${shellStyles.surfaceCard} glass-panel`}
              >
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold tracking-tight">{card.fullName}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${meta.className}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
                      <span>{card.jobTitle || "No job title"}</span>
                      <span>{card.company || "No company"}</span>
                      <span>{card._count.views} views</span>
                      <span>{card._count.leads} leads</span>
                      <span className="font-[family-name:var(--font-mono)]">/{card.slug}</span>
                    </div>

                    {card.adminNote && (
                      <div className="mt-5 rounded-[22px] border border-white/8 bg-[rgba(2,6,23,0.64)] p-4">
                        <p className={`mono ${shellStyles.spotlightLabel}`}>ACTIVATION NOTE</p>
                        <p className="text-sm leading-7">{card.adminNote}</p>
                        {card.adminNoteUpdatedAt && (
                          <p className={`mt-2 ${shellStyles.toolbarHint}`}>
                            Updated {formatTimestamp(card.adminNoteUpdatedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`${shellStyles.buttonRow} xl:flex-col`}>
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
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <AdminAuditFeed
        entries={data.audit}
        title="Owner activity timeline"
        emptyText="No audit events yet for this owner."
      />
    </DashboardShell>
  );
}
