"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Filter,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

interface Lead {
  id: string;
  cardId: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  notes?: string | null;
  status: LeadStatus;
  source: string;
  createdAt: string;
  card: { fullName: string; slug: string };
}

interface CardOption {
  id: string;
  fullName: string;
  slug: string;
}

const STATUS_OPTIONS: { value: LeadStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
  contacted: "text-amber-200 border-amber-500/30 bg-amber-500/10",
  qualified: "text-blue-300 border-blue-500/30 bg-blue-500/10",
  converted: "text-emerald-200 border-emerald-500/30 bg-emerald-500/10",
  lost: "text-rose-200 border-rose-500/30 bg-rose-500/10",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  lost: "Lost",
};

function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatLeadDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cards, setCards] = useState<CardOption[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCardId, setFilterCardId] = useState<string>("");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchLeads = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterCardId) params.set("cardId", filterCardId);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total ?? 0);
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [status, filterStatus, filterCardId, page, limit]);

  const fetchCards = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch("/api/cards");
      const data = await res.json();
      setCards(data.cards || []);
    } catch {
      console.error("Failed to fetch cards");
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchLeads();
      void fetchCards();
    }
  }, [status, fetchLeads, fetchCards]);

  const patchLead = async (
    id: string,
    updates: { status?: LeadStatus; notes?: string }
  ) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...data.lead } : lead))
      );
    } catch {
      alert("Update failed");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      setTotal((current) => Math.max(0, current - 1));
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const startNotesEdit = (lead: Lead) => {
    setEditingNotes(lead.id);
    setNotesValue(lead.notes || "");
  };

  const saveNotes = async () => {
    if (!editingNotes) return;
    await patchLead(editingNotes, { notes: notesValue });
    setEditingNotes(null);
  };

  const thisWeekCount = useMemo(
    () =>
      leads.filter((lead) => new Date(lead.createdAt) >= getWeekStart(new Date()))
        .length,
    [leads]
  );

  const contactableCount = useMemo(
    () => leads.filter((lead) => lead.email || lead.phone).length,
    [leads]
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (
    status === "loading" ||
    (status === "authenticated" && loading && leads.length === 0)
  ) {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="LEAD PIPELINE"
      title={
        <>
          Lead capture, <span className="gradient-text">cleanly organized</span>.
        </>
      }
      description="Track incoming contacts from your digital cards, move them through real pipeline states, add notes, and keep every handoff visible without leaving the workspace."
      navItems={[
        { href: "/dashboard", label: "Cards", icon: CreditCard },
        { href: "/dashboard/leads", label: "Leads", icon: Users, active: true },
        {
          href: "/dashboard/templates",
          label: "Templates",
          icon: Sparkles,
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
          <Link href="/dashboard" className={shellStyles.actionButtonGhost}>
            <CreditCard className={shellStyles.buttonIcon} />
            Back to cards
          </Link>
        </>
      }
      heroAside={
        <>
          <div className={`${shellStyles.spotlight} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>PIPELINE SIGNAL</p>
            <h2 className={shellStyles.spotlightTitle}>
              {total} total leads, {leads.filter((lead) => lead.status === "new").length} new on this view.
            </h2>
            <p className={shellStyles.spotlightText}>
              Every lead is linked back to the originating card so you can see
              which identities convert best and where manual follow-up is needed.
            </p>
            <div className={shellStyles.spotlightBadges}>
              <span className={shellStyles.spotlightBadge}>
                <Users className={shellStyles.spotlightBadgeIcon} />
                CRM-ready capture
              </span>
              <span className={shellStyles.spotlightBadge}>
                <MessageSquare className={shellStyles.spotlightBadgeIcon} />
                Notes + status flow
              </span>
            </div>
          </div>

          <div className={shellStyles.metricGrid}>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>This week</span>
              <span className={shellStyles.metricTileValue}>{thisWeekCount}</span>
            </div>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Reachable</span>
              <span className={shellStyles.metricTileValue}>{contactableCount}</span>
            </div>
          </div>
        </>
      }
      stats={[
        {
          label: "Total",
          value: total,
          hint: "All leads across the current workspace.",
        },
        {
          label: "New",
          value: leads.filter((lead) => lead.status === "new").length,
          hint: "Fresh leads in the current result set.",
          tone: "amber",
        },
        {
          label: "This week",
          value: thisWeekCount,
          hint: "Leads captured since the current week started.",
          tone: "violet",
        },
        {
          label: "Reachable",
          value: contactableCount,
          hint: "Leads with at least one direct contact channel.",
          tone: "emerald",
        },
      ]}
    >
      <section className={`${shellStyles.surfaceCard} glass-panel`}>
        <div className={shellStyles.surfaceHeader}>
          <div>
            <p className={`mono ${shellStyles.spotlightLabel}`}>FILTERS</p>
            <h2 className={shellStyles.surfaceTitle}>Slice the pipeline fast</h2>
            <p className={shellStyles.surfaceDescription}>
              Narrow by status or source card, then refresh the list without losing context.
            </p>
          </div>
        </div>

        <div className={shellStyles.toolbar}>
          <label className="relative min-w-[220px]">
            <Filter className={shellStyles.toolbarFieldIcon} />
            <select
              value={filterStatus}
              onChange={(event) => {
                setFilterStatus(event.target.value);
                setPage(1);
              }}
              className={`${shellStyles.toolbarSelect} pl-11`}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative min-w-[260px]">
            <Search className={shellStyles.toolbarFieldIcon} />
            <select
              value={filterCardId}
              onChange={(event) => {
                setFilterCardId(event.target.value);
                setPage(1);
              }}
              className={`${shellStyles.toolbarSelect} pl-11`}
            >
              <option value="">All cards</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.fullName} /{card.slug}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => void fetchLeads()}
            disabled={loading}
            className={shellStyles.actionButton}
          >
            {loading ? (
              <Loader2 className={shellStyles.buttonIcon} />
            ) : (
              <Filter className={shellStyles.buttonIcon} />
            )}
            Apply
          </button>
        </div>
      </section>

      <section className={`${shellStyles.surfaceCard} glass-panel`}>
        <div className={shellStyles.surfaceHeader}>
          <div>
            <p className={`mono ${shellStyles.spotlightLabel}`}>LEAD LIST</p>
            <h2 className={shellStyles.surfaceTitle}>Recent contacts and follow-up state</h2>
            <p className={shellStyles.surfaceDescription}>
              Update status, attach notes, and jump to the source card straight from the list.
            </p>
          </div>

          <div className={shellStyles.pillRow}>
            <span className={shellStyles.pill}>
              <Calendar className={shellStyles.pillIcon} />
              Page {page} of {totalPages}
            </span>
          </div>
        </div>

        {loading && leads.length > 0 ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className={shellStyles.loadingSpinner} />
          </div>
        ) : leads.length === 0 ? (
          <div className={shellStyles.emptyState}>
            <div className={shellStyles.emptyIconWrap}>
              <Users className={shellStyles.emptyIcon} />
            </div>
            <h3 className={shellStyles.emptyTitle}>No leads yet</h3>
            <p className={shellStyles.emptyText}>
              Leads will appear here when someone shares contact details from one of your cards.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {leads.map((lead) => (
              <article key={lead.id} className={`${shellStyles.surfaceCard} glass-panel`}>
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {lead.name || "Unnamed contact"}
                      </h3>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setStatusDropdown(
                              statusDropdown === lead.id ? null : lead.id
                            )
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${STATUS_COLORS[lead.status]}`}
                        >
                          {STATUS_LABELS[lead.status]}
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {statusDropdown === lead.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setStatusDropdown(null)}
                            />
                            <div className="absolute left-0 top-full z-20 mt-2 min-w-[160px] rounded-2xl border border-white/10 bg-[rgba(2,6,23,0.96)] p-2 shadow-2xl">
                              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(
                                (nextStatus) => (
                                  <button
                                    key={nextStatus}
                                    onClick={() => {
                                      void patchLead(lead.id, {
                                        status: nextStatus,
                                      });
                                      setStatusDropdown(null);
                                    }}
                                    className="block w-full rounded-xl px-4 py-2 text-left text-sm text-[var(--color-text-muted)] hover:bg-white/6 hover:text-white"
                                  >
                                    {STATUS_LABELS[nextStatus]}
                                  </button>
                                )
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={shellStyles.badge}>
                        <ExternalLink className={shellStyles.badgeIcon} />
                        {lead.card.fullName}
                      </span>
                      <span className={shellStyles.badge}>
                        <Calendar className={shellStyles.badgeIcon} />
                        {formatLeadDate(lead.createdAt)}
                      </span>
                      <span className={shellStyles.badge}>
                        <Sparkles className={shellStyles.badgeIcon} />
                        {lead.source}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--color-text-muted)]">
                      <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[var(--color-cyan)]" />
                          {lead.email || "No email provided"}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[var(--color-cyan)]" />
                          {lead.phone || "No phone provided"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-white/8 bg-[rgba(2,6,23,0.64)] p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className={`mono ${shellStyles.spotlightLabel}`}>FOLLOW-UP NOTE</p>
                        <Link
                          href={`/card/${lead.card.slug}`}
                          target="_blank"
                          className={shellStyles.actionButtonGhost}
                        >
                          <ExternalLink className={shellStyles.buttonIcon} />
                          Open source card
                        </Link>
                      </div>

                      {editingNotes === lead.id ? (
                        <div>
                          <textarea
                            rows={3}
                            value={notesValue}
                            onChange={(event) => setNotesValue(event.target.value)}
                            placeholder="Add follow-up notes, call outcomes, or context"
                            className={shellStyles.textarea}
                            autoFocus
                          />
                          <div className={`${shellStyles.buttonRow} mt-3 justify-end`}>
                            <button
                              onClick={() => {
                                setEditingNotes(null);
                                setNotesValue(lead.notes || "");
                              }}
                              className={shellStyles.actionButtonGhost}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => void saveNotes()}
                              className={shellStyles.actionButton}
                            >
                              Save note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                            {lead.notes || "No notes yet. Add context for the next follow-up touch."}
                          </p>
                          <div className={shellStyles.buttonRow}>
                            <button
                              onClick={() => startNotesEdit(lead)}
                              className={shellStyles.actionButtonGhost}
                            >
                              <MessageSquare className={shellStyles.buttonIcon} />
                              Edit note
                            </button>
                            <button
                              onClick={() => void deleteLead(lead.id)}
                              disabled={deleting === lead.id}
                              className={shellStyles.actionButtonDanger}
                            >
                              {deleting === lead.id ? (
                                <Loader2 className={shellStyles.buttonIcon} />
                              ) : (
                                <Trash2 className={shellStyles.buttonIcon} />
                              )}
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {total > limit && (
          <div className={`${shellStyles.buttonRow} mt-6 justify-center`}>
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className={shellStyles.actionButtonGhost}
            >
              Previous
            </button>
            <span className={shellStyles.userPill}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= totalPages}
              className={shellStyles.actionButtonGhost}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
