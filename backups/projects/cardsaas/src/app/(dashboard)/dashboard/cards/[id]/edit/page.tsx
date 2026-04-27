"use client";

import { useEffect, useState, use } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ExternalLink,
  Loader2,
  Palette,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import CardForm from "@/components/CardForm";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";

export default function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();
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
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  if (!card) return null;

  return (
    <DashboardShell
      eyebrow="CARD EDITOR"
      title={
        <>
          Refine the card, <span className="gradient-text">then ship the experience</span>.
        </>
      }
      description="Polish the content, adjust theme-specific fields, and tighten the activation flow while we work fully on the local workspace."
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
          <Link href="/dashboard" className={shellStyles.actionButtonGhost}>
            <CreditCard className={shellStyles.buttonIcon} />
            Back to cards
          </Link>
          <Link
            href={`/card/${String(card.slug || "")}`}
            target="_blank"
            className={shellStyles.actionButton}
          >
            <ExternalLink className={shellStyles.buttonIcon} />
            Preview public card
          </Link>
        </>
      }
      heroAside={
        <div className={`${shellStyles.spotlight} glass-panel`}>
          <p className={`mono ${shellStyles.spotlightLabel}`}>EDIT FLOW</p>
          <h2 className={shellStyles.spotlightTitle}>
            We can iterate the builder locally before one clean release.
          </h2>
          <p className={shellStyles.spotlightText}>
            This is the safe place to simplify card editing, remove UX detours, and make the activation experience feel obvious.
          </p>
          <div className={shellStyles.spotlightBadges}>
            <span className={shellStyles.spotlightBadge}>
              <Sparkles className={shellStyles.spotlightBadgeIcon} />
              Local preview
            </span>
            <span className={shellStyles.spotlightBadge}>
              <ShieldCheck className={shellStyles.spotlightBadgeIcon} />
              No prod risk
            </span>
          </div>
        </div>
      }
      stats={[
        {
          label: "Mode",
          value: "Edit",
          hint: "Existing card loaded from local database.",
        },
        {
          label: "Card",
          value: String(card.fullName || "Draft"),
          hint: "Current record under refinement.",
          tone: "violet",
        },
        {
          label: "Theme",
          value: String(card.theme || "Unknown"),
          hint: "Current public presentation layer.",
          tone: "emerald",
        },
      ]}
    >
      <CardForm
        mode="edit"
        cardId={id}
        initialData={card as Record<string, string>}
      />
    </DashboardShell>
  );
}
