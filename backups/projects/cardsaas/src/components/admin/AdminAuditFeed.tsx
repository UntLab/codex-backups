"use client";

import Link from "next/link";
import { Clock3, History, ShieldCheck } from "lucide-react";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";

export interface AdminAuditEntry {
  id: string;
  action: string;
  entityType: "card" | "owner";
  status: string | null;
  note: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  actorUser: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
  targetUser: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
  targetCard: {
    id: string | null;
    slug: string | null;
    fullName: string | null;
  };
}

function formatActionLabel(action: string): string {
  if (action === "card_status_updated") return "Card status updated";
  if (action === "card_note_saved") return "Card note saved";
  if (action === "owner_bulk_status_updated") return "Owner bulk update";
  return action.replaceAll("_", " ");
}

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString();
}

export default function AdminAuditFeed({
  entries,
  title = "Recent admin activity",
  emptyText = "No admin activity yet.",
}: {
  entries: AdminAuditEntry[];
  title?: string;
  emptyText?: string;
}) {
  return (
    <section className={`${shellStyles.surfaceCard} glass-panel`}>
      <div className={shellStyles.surfaceHeader}>
        <div>
          <p className={`mono ${shellStyles.spotlightLabel}`}>AUDIT FEED</p>
          <h2 className={shellStyles.surfaceTitle}>{title}</h2>
          <p className={shellStyles.surfaceDescription}>
            Trace approvals, pauses, notes, and owner-level operations in one
            running timeline.
          </p>
        </div>

        <div className={shellStyles.pill}>
          <History className={shellStyles.pillIcon} />
          Activity stream
        </div>
      </div>

      {entries.length === 0 ? (
        <div className={`${shellStyles.emptyState} glass-panel`}>
          <div className={shellStyles.emptyIconWrap}>
            <History className={shellStyles.emptyIcon} />
          </div>
          <h3 className={shellStyles.emptyTitle}>No audit activity yet</h3>
          <p className={shellStyles.emptyText}>{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className={`${shellStyles.surfaceCard} glass-panel`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={shellStyles.badge}>
                      <ShieldCheck className={shellStyles.badgeIcon} />
                      {formatActionLabel(entry.action)}
                    </span>
                    {entry.status && (
                      <span className={shellStyles.badge}>
                        {entry.status}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                    {entry.actorUser.email || entry.actorUser.name || "Unknown admin"} changed{" "}
                    {entry.entityType === "owner" ? "an owner" : "a card"}.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
                    {entry.targetUser.id && (
                      <Link
                        href={`/dashboard/admin/owners/${entry.targetUser.id}`}
                        className="hover:text-[var(--color-neon)] transition-colors"
                      >
                        Owner: {entry.targetUser.email || entry.targetUser.name}
                      </Link>
                    )}
                    {entry.targetCard.id && (
                      <Link
                        href={`/dashboard/cards/${entry.targetCard.id}/edit`}
                        className="hover:text-[var(--color-neon)] transition-colors"
                      >
                        Card: {entry.targetCard.fullName || entry.targetCard.slug}
                      </Link>
                    )}
                  </div>

                  {entry.note && (
                    <p className="mt-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm leading-7">
                      {entry.note}
                    </p>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                  <Clock3 className="w-3.5 h-3.5" />
                  {formatTimestamp(entry.createdAt)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
