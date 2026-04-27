"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Palette,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import CardForm from "@/components/CardForm";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";

export default function NewCardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={shellStyles.loadingPage}>
        <div className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="CARD BUILDER"
      title={
        <>
          Build a card, <span className="gradient-text">without the clutter</span>.
        </>
      }
      description="Use the local builder to shape the public card experience first, then we will harden the launch and approval flow once the interaction feels right."
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
          <Link href="/dashboard/templates" className={shellStyles.actionButton}>
            <Sparkles className={shellStyles.buttonIcon} />
            Browse templates
          </Link>
        </>
      }
      heroAside={
        <div className={`${shellStyles.spotlight} glass-panel`}>
          <p className={`mono ${shellStyles.spotlightLabel}`}>CREATE FLOW</p>
          <h2 className={shellStyles.spotlightTitle}>
            Start from a template, then only touch what matters.
          </h2>
          <p className={shellStyles.spotlightText}>
            For fixed corporate themes like Formag or PRG, we want the builder to feel closer to a guided publishing flow than a generic profile editor.
          </p>
          <div className={shellStyles.spotlightBadges}>
            <span className={shellStyles.spotlightBadge}>
              <Sparkles className={shellStyles.spotlightBadgeIcon} />
              Theme-first
            </span>
            <span className={shellStyles.spotlightBadge}>
              <ShieldCheck className={shellStyles.spotlightBadgeIcon} />
              Local-only edits
            </span>
          </div>
        </div>
      }
      stats={[
        {
          label: "Mode",
          value: "Create",
          hint: "New card draft in local workspace.",
        },
        {
          label: "Templates",
          value: "Live",
          hint: "System presets can be applied before saving.",
          tone: "violet",
        },
        {
          label: "Activation",
          value: "Manual",
          hint: "Public launch still respects approval state.",
          tone: "amber",
        },
      ]}
    >
      <CardForm mode="create" />
    </DashboardShell>
  );
}
