"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  LogOut,
  Users,
  Phone,
  Mail,
  Filter,
  Trash2,
  MessageSquare,
  ChevronDown,
  Loader2,
  Calendar,
  FileText,
} from "lucide-react";

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
  new: "text-cyan-400 border-cyan-500/50 bg-cyan-500/10",
  contacted: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
  qualified: "text-blue-400 border-blue-500/50 bg-blue-500/10",
  converted: "text-green-400 border-green-500/50 bg-green-500/10",
  lost: "text-[var(--color-neon-danger)] border-[var(--color-neon-danger)]/50 bg-[var(--color-neon-danger)]/10",
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
      fetchLeads();
    }
  }, [status, fetchLeads]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCards();
    }
  }, [status, fetchCards]);


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
        prev.map((l) => (l.id === id ? { ...l, ...data.lead } : l))
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
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setTotal((t) => Math.max(0, t - 1));
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

  const thisWeekCount = leads.filter(
    (l) => new Date(l.createdAt) >= getWeekStart(new Date())
  ).length;

  if (status === "loading" || (status === "authenticated" && loading && leads.length === 0)) {
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
              href="/dashboard"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
            >
              Cards
            </Link>
            <span className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)] hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon-danger)] transition-colors font-[family-name:var(--font-geist-mono)]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Leads</h1>
            <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
              CRM and contact management from your digital cards
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-neon)]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--color-neon)]" />
              </div>
              <div>
                <p className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]">
                  {total}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Total Leads
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]">
                  {leads.filter((l) => l.status === "new").length}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  New
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]">
                  {thisWeekCount}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  This Week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="v2-input-compact w-auto min-w-[160px] font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={filterCardId}
            onChange={(e) => {
              setFilterCardId(e.target.value);
              setPage(1);
            }}
            className="v2-input-compact min-w-[220px] font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)]"
          >
            <option value="">All cards</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} /{c.slug}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchLeads()}
            disabled={loading}
            className="v2-button-compact text-sm font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
            Apply
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          {loading && leads.length > 0 ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[var(--color-neon)] animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Leads will appear when someone shares their contact details on your card
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Card
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right py-4 px-6 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface)]/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-medium">
                          {lead.name || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                          <Mail className="w-3.5 h-3.5" />
                          {lead.email || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/card/${lead.card.slug}`}
                          target="_blank"
                          className="text-sm text-[var(--color-neon)] hover:underline font-[family-name:var(--font-geist-mono)]"
                        >
                          {lead.card.fullName}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setStatusDropdown(
                                statusDropdown === lead.id ? null : lead.id
                              )
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-[family-name:var(--font-geist-mono)] ${STATUS_COLORS[lead.status]}`}
                          >
                            {STATUS_LABELS[lead.status]}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {statusDropdown === lead.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setStatusDropdown(null)}
                              />
                              <div className="absolute left-0 top-full mt-1 z-20 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl min-w-[140px]">
                                {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(
                                  (s) => (
                                    <button
                                      key={s}
                                      onClick={() => {
                                        patchLead(lead.id, { status: s });
                                        setStatusDropdown(null);
                                      }}
                                      className={`w-full text-left px-4 py-2 text-sm font-[family-name:var(--font-geist-mono)] hover:bg-[var(--color-bg-base)] ${s === lead.status ? "text-[var(--color-neon)]" : "text-[var(--color-text-muted)]"}`}
                                    >
                                      {STATUS_LABELS[s]}
                                    </button>
                                  )
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                          {new Date(lead.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingNotes === lead.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={notesValue}
                                onChange={(e) => setNotesValue(e.target.value)}
                                placeholder="Notes..."
                                className="v2-input-compact w-48 font-[family-name:var(--font-geist-mono)]"
                                autoFocus
                              />
                              <button
                                onClick={saveNotes}
                                className="text-xs text-[var(--color-neon)] hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNotes(null);
                                  setNotesValue(lead.notes || "");
                                }}
                                className="text-xs text-[var(--color-text-muted)] hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startNotesEdit(lead)}
                              className="p-2 rounded-md border border-[var(--color-border)] hover:border-[var(--color-neon)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-neon)]"
                              title="Notes"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteLead(lead.id)}
                            disabled={deleting === lead.id}
                            className="p-2 rounded-md border border-[var(--color-border)] hover:border-[var(--color-neon-danger)] hover:text-[var(--color-neon-danger)] transition-colors text-[var(--color-text-muted)] disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === lead.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {total > limit && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-[family-name:var(--font-geist-mono)] hover:border-[var(--color-neon)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
              {page} / {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-[family-name:var(--font-geist-mono)] hover:border-[var(--color-neon)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
