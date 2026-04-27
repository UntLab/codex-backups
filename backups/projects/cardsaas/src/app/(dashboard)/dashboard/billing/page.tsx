"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";
import { clientBillingMode, MANUAL_BILLING_MESSAGE } from "@/lib/billing";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isManualMode = clientBillingMode === "manual";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="BILLING STATE"
      title={
        <>
          Access mode, <span className="gradient-text">explicitly controlled</span>.
        </>
      }
      description="This surface explains how activation currently works, what is live today, and how the future billing layer will plug in once payments are enabled."
      navItems={[
        { href: "/dashboard", label: "Cards", icon: CreditCard },
        {
          href: "/dashboard/leads",
          label: "Leads",
          icon: Users,
          hiddenUntil: "md",
        },
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
        {
          href: "/dashboard/billing",
          label: "Billing",
          icon: Wallet,
          active: true,
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
            Back to dashboard
          </Link>
          {isManualMode && session?.user?.isAdmin ? (
            <Link href="/dashboard/admin" className={shellStyles.actionButton}>
              <ShieldCheck className={shellStyles.buttonIcon} />
              Open admin queue
            </Link>
          ) : null}
        </>
      }
      heroAside={
        <>
          <div className={`${shellStyles.spotlight} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>MODE SIGNAL</p>
            <h2 className={shellStyles.spotlightTitle}>
              {isManualMode ? "Manual activation is live." : "Automated billing is paused."}
            </h2>
            <p className={shellStyles.spotlightText}>
              {isManualMode
                ? `${MANUAL_BILLING_MESSAGE} New cards enter a controlled pending state and move live only after explicit admin approval.`
                : "Paid billing is still disabled while the payment stack is deferred. The UI already reserves the space for that future layer."}
            </p>
            <div className={shellStyles.spotlightBadges}>
              <span className={shellStyles.spotlightBadge}>
                <ShieldCheck className={shellStyles.spotlightBadgeIcon} />
                {isManualMode ? "Manual approval" : "Payments deferred"}
              </span>
              <span className={shellStyles.spotlightBadge}>
                <Wallet className={shellStyles.spotlightBadgeIcon} />
                Stripe later
              </span>
            </div>
          </div>

          <div className={shellStyles.metricGrid}>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Current mode</span>
              <span className={shellStyles.metricTileValue}>
                {isManualMode ? "Manual" : "Paused"}
              </span>
            </div>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Payments</span>
              <span className={shellStyles.metricTileValue}>Later</span>
            </div>
          </div>
        </>
      }
      stats={[
        {
          label: "Mode",
          value: isManualMode ? "Manual" : "Paused",
          hint: "Current access and billing behavior in production.",
        },
        {
          label: "Activation",
          value: isManualMode ? "Admin" : "Off",
          hint: "How cards are made live for end users.",
          tone: "amber",
        },
        {
          label: "Payments",
          value: "Later",
          hint: "Stripe remains deferred for a future phase.",
          tone: "violet",
        },
        {
          label: "Readiness",
          value: isManualMode ? "Stable" : "Queued",
          hint: "Current product path before paid billing arrives.",
          tone: "emerald",
        },
      ]}
    >
      <section className={`${shellStyles.surfaceCard} glass-panel`}>
        <div className={shellStyles.surfaceHeader}>
          <div>
            <p className={`mono ${shellStyles.spotlightLabel}`}>CURRENT STATE</p>
            <h2 className={shellStyles.surfaceTitle}>
              {isManualMode ? "Manual activation workflow" : "Billing placeholder state"}
            </h2>
            <p className={shellStyles.surfaceDescription}>
              {isManualMode
                ? "This workspace is already operational without Stripe. Cards are created, reviewed by admin, and then switched to active or paused manually."
                : "The product surface is ready for billing, but real payment collection is intentionally delayed until the Stripe account is available."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <article className={`${shellStyles.surfaceCard} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>1. CREATE</p>
            <h3 className={shellStyles.surfaceTitle}>Cards start in a controlled state</h3>
            <p className={shellStyles.surfaceDescription}>
              New cards can be created immediately without forcing payment setup first.
            </p>
          </article>
          <article className={`${shellStyles.surfaceCard} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>2. REVIEW</p>
            <h3 className={shellStyles.surfaceTitle}>Admin validates the launch</h3>
            <p className={shellStyles.surfaceDescription}>
              Notes, owner-level changes, and activation status are all handled inside the admin layer.
            </p>
          </article>
          <article className={`${shellStyles.surfaceCard} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>3. GO LIVE</p>
            <h3 className={shellStyles.surfaceTitle}>Public access stays intentional</h3>
            <p className={shellStyles.surfaceDescription}>
              Only approved cards become visible until the future payment tier is introduced.
            </p>
          </article>
        </div>

        <div className={`${shellStyles.buttonRow} mt-6`}>
          <Link href="/dashboard" className={shellStyles.actionButtonGhost}>
            <CreditCard className={shellStyles.buttonIcon} />
            Return to cards
          </Link>
          {isManualMode && session?.user?.isAdmin ? (
            <Link href="/dashboard/admin" className={shellStyles.actionButton}>
              <ShieldCheck className={shellStyles.buttonIcon} />
              Manage activation queue
            </Link>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}
