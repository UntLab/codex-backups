import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CreditCard,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import styles from "./auth.module.css";

const metrics = [
  { value: "15+", label: "premium themes" },
  { value: "24/7", label: "share-ready cards" },
  { value: "n8n", label: "workflow sync" },
];

const highlights: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Sparkles,
    title: "Same visual system as the landing",
    description:
      "The private access layer now speaks the same premium language as the public product surface.",
  },
  {
    icon: ScanLine,
    title: "Fast access to cards and leads",
    description:
      "Jump back into digital cards, lead flow, and manual activation controls without the generic dashboard feel.",
  },
  {
    icon: Workflow,
    title: "Built for product operations",
    description:
      "Themes, lead routing, team workflows, and future automations all stay in one controlled workspace.",
  },
];

export default function AuthShell({
  panelEyebrow,
  panelTitle,
  panelDescription,
  secondaryHref,
  secondaryLabel,
  children,
  footer,
}: {
  panelEyebrow: string;
  panelTitle: string;
  panelDescription: string;
  secondaryHref: string;
  secondaryLabel: string;
  children: ReactNode;
  footer?: ReactNode;
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
          <Link href="/" className={styles.brand}>
            <span className={styles.brandLead}>UNT</span>
            <span className="gradient-text">LAB</span>
          </Link>

          <div className={styles.headerActions}>
            <Link href="/" className={styles.headerLink}>
              Back to landing
            </Link>
            <Link href={secondaryHref} className={styles.headerCta}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.shell}>
        <section className={styles.showcase}>
          <div className={styles.showcaseIntro}>
            <p className={`mono ${styles.eyebrow}`}>NEXT-GEN IDENTITY PLATFORM</p>
            <h1 className={styles.heroTitle}>
              Digital Identity, <span className="gradient-text">Redefined</span>.
            </h1>
            <p className={styles.heroCopy}>
              The auth layer should feel like part of the product, not a random
              admin afterthought. This portal now tracks the same cinematic,
              glass-heavy direction as the main landing experience.
            </p>
          </div>

          <div className={styles.metricRow}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.highlightGrid}>
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className={`${styles.highlightCard} glass-panel`}>
                  <div className={styles.highlightIconWrap}>
                    <Icon className={styles.highlightIcon} />
                  </div>
                  <div>
                    <h2 className={styles.highlightTitle}>{item.title}</h2>
                    <p className={styles.highlightText}>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={`${styles.commandStrip} glass-panel`}>
            <div className={styles.commandMeta}>
              <span className={`mono ${styles.commandLabel}`}>ACCESS LAYER</span>
              <p className={styles.commandText}>
                Secure entry to cards, leads, team workflows, and premium theme
                management.
              </p>
            </div>

            <div className={styles.commandBadges}>
              <span className={styles.commandBadge}>
                <ShieldCheck className={styles.commandBadgeIcon} />
                Protected session
              </span>
              <span className={styles.commandBadge}>
                <CreditCard className={styles.commandBadgeIcon} />
                Cards + billing state
              </span>
            </div>
          </div>
        </section>

        <section className={`${styles.panel} glass-panel`}>
          <div className={styles.panelTop}>
            <p className={`mono ${styles.panelEyebrow}`}>{panelEyebrow}</p>
            <h2 className={styles.panelTitle}>{panelTitle}</h2>
            <p className={styles.panelDescription}>{panelDescription}</p>
          </div>

          <div className={styles.panelBody}>{children}</div>

          {footer && <div className={styles.panelFooter}>{footer}</div>}

          <div className={styles.panelCornerLink}>
            <Link href="/" className={styles.cornerLink}>
              Explore the main site
              <ArrowRight className={styles.cornerLinkIcon} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
