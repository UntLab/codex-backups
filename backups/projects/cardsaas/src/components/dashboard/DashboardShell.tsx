"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CreditCard, LogOut } from "lucide-react";
import styles from "./dashboard-shell.module.css";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  hiddenUntil?: "md" | "lg";
}

export interface DashboardStatItem {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "violet" | "emerald" | "amber" | "rose";
}

export default function DashboardShell({
  eyebrow,
  title,
  description,
  navItems,
  sessionLabel,
  onSignOut,
  heroActions,
  heroAside,
  stats,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  navItems: DashboardNavItem[];
  sessionLabel?: string | null;
  onSignOut: () => void;
  heroActions?: ReactNode;
  heroAside?: ReactNode;
  stats?: DashboardStatItem[];
  children: ReactNode;
}) {
  return (
    <div className={`${styles.page} cyber-grid`}>
      <div className="scanlines" aria-hidden="true" />

      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.orbIndigo} />
        <div className={styles.orbViolet} />
        <div className={styles.orbCyan} />
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>
              <CreditCard className={styles.brandMarkIcon} />
            </span>
            <span className={styles.brandCopy}>
              <span className={styles.brandTitle}>
                UNT<span className="gradient-text">LAB</span>
              </span>
              <span className={styles.brandSubtitle}>Private workspace</span>
            </span>
          </Link>

          <div className={styles.headerActions}>
            <nav className={styles.nav} aria-label="Dashboard navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const hideClass =
                  item.hiddenUntil === "md"
                    ? styles.hideMd
                    : item.hiddenUntil === "lg"
                      ? styles.hideLg
                      : "";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      styles.navLink,
                      item.active ? styles.navLinkActive : "",
                      hideClass,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {Icon && <Icon className={styles.navIcon} />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className={styles.headerMeta}>
              {sessionLabel ? (
                <span className={styles.userPill}>{sessionLabel}</span>
              ) : null}
              <button onClick={onSignOut} className={styles.signOutButton}>
                <LogOut className={styles.signOutIcon} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroLead}>
            <p className={`mono ${styles.heroEyebrow}`}>
              <span className={styles.heroEyebrowDot} />
              {eyebrow}
            </p>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroDescription}>{description}</p>
            {heroActions ? (
              <div className={styles.heroActions}>{heroActions}</div>
            ) : null}
          </div>

          {heroAside ? <div className={styles.heroAside}>{heroAside}</div> : null}
        </section>

        {stats && stats.length > 0 ? (
          <section className={styles.statsGrid}>
            {stats.map((item) => (
              <article
                key={item.label}
                className={styles.statCard}
                data-tone={item.tone ?? "default"}
              >
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statValue}>{item.value}</span>
                {item.hint ? (
                  <span className={styles.statHint}>{item.hint}</span>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
}
