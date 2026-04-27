"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Eye,
  Loader2,
  Palette,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";
import {
  FORMAG_ACCENT,
  FORMAG_BG,
  FORMAG_THEME,
} from "@/lib/formag";
import {
  PRG_ACCENT,
  PRG_BG,
  PRG_ORANGE_ACCENT,
  PRG_ORANGE_BG,
  PRG_ORANGE_THEME,
  PRG_THEME,
} from "@/lib/prg";

interface Template {
  id: string;
  name: string;
  userId?: string | null;
  isPublic: boolean;
  isSystem: boolean;
  theme: string;
  accentColor: string;
  bgColor: string;
  fontFamily: string;
  borderRadius: string;
  cardStyle?: string | null;
  preview?: string | null;
  createdAt: string;
}

const THEME_OPTIONS = [
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "minimal", label: "Minimal" },
  { value: "gradient", label: "Gradient" },
  { value: PRG_THEME, label: "PRG Tech" },
  { value: PRG_ORANGE_THEME, label: "PRG Tech Orange" },
  { value: FORMAG_THEME, label: "Formag Corporate" },
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Roboto", label: "Roboto" },
];

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    theme: "cyberpunk",
    accentColor: "#00ffcc",
    bgColor: "#030305",
    fontFamily: "Inter",
    borderRadius: "16",
    isPublic: false,
  });

  const applyThemeDefaults = (theme: string) => {
    if (theme === FORMAG_THEME) {
      return {
        theme,
        accentColor: FORMAG_ACCENT,
        bgColor: FORMAG_BG,
        fontFamily: "Inter",
        borderRadius: "12",
      };
    }

    if (theme === PRG_THEME) {
      return {
        theme,
        accentColor: PRG_ACCENT,
        bgColor: PRG_BG,
        fontFamily: "Space Grotesk",
        borderRadius: "20",
      };
    }

    if (theme === PRG_ORANGE_THEME) {
      return {
        theme,
        accentColor: PRG_ORANGE_ACCENT,
        bgColor: PRG_ORANGE_BG,
        fontFamily: "Space Grotesk",
        borderRadius: "20",
      };
    }

    return { theme };
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchTemplates();
    }
  }, [status]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch {
      console.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const useTemplate = (template: Template) => {
    const settings = {
      theme: template.theme,
      accentColor: template.accentColor,
      bgColor: template.bgColor,
      fontFamily: template.fontFamily,
      borderRadius: template.borderRadius,
    };

    try {
      localStorage.setItem("cardTemplateSettings", JSON.stringify(settings));
      localStorage.setItem(
        "cardTemplateMeta",
        JSON.stringify({
          id: template.id,
          name: template.name,
          theme: template.theme,
          isSystem: template.isSystem,
        })
      );
    } catch {
      // ignore localStorage failures and continue with routing
    }

    router.push("/dashboard/cards/new");
  };

  const createTemplate = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.template) {
        setTemplates((prev) => [data.template, ...prev]);
        setModalOpen(false);
        setForm({
          name: "",
          theme: "cyberpunk",
          accentColor: "#00ffcc",
          bgColor: "#030305",
          fontFamily: "Inter",
          borderRadius: "16",
          isPublic: false,
        });
      } else {
        alert(data.error || "Failed to create template");
      }
    } catch {
      alert("Failed to create template");
    } finally {
      setCreateLoading(false);
    }
  };

  const systemTemplates = useMemo(
    () => templates.filter((template) => template.isSystem),
    [templates]
  );
  const myTemplates = useMemo(
    () => templates.filter((template) => !template.isSystem),
    [templates]
  );
  const publicCount = useMemo(
    () => templates.filter((template) => template.isPublic).length,
    [templates]
  );

  const getBadge = (template: Template) => {
    if (template.isSystem) return "System";
    if (template.isPublic) return "Public";
    return "Private";
  };

  const getBadgeClass = (template: Template) => {
    if (template.isSystem)
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    if (template.isPublic)
      return "border-blue-500/30 bg-blue-500/10 text-blue-200";
    return "border-white/10 bg-white/4 text-[var(--color-text-muted)]";
  };

  if (status === "loading" || loading) {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <>
      <DashboardShell
        eyebrow="DESIGN SYSTEM"
        title={
          <>
            Template library, <span className="gradient-text">ready to reuse</span>.
          </>
        }
        description="Save visual directions as reusable card templates, duplicate the look into new cards, and keep system and personal styles in one organized library."
        navItems={[
          { href: "/dashboard", label: "Cards", icon: CreditCard },
          {
            href: "/dashboard/leads",
            label: "Leads",
            icon: Users,
            hiddenUntil: "md",
          },
          { href: "/dashboard/templates", label: "Templates", icon: Palette, active: true },
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
            <button
              onClick={() => setModalOpen(true)}
              className={shellStyles.actionButton}
            >
              <Plus className={shellStyles.buttonIcon} />
              Create template
            </button>
            <Link href="/dashboard/cards/new" className={shellStyles.actionButtonGhost}>
              <CreditCard className={shellStyles.buttonIcon} />
              New card
            </Link>
          </>
        }
        heroAside={
          <>
            <div className={`${shellStyles.spotlight} glass-panel`}>
              <p className={`mono ${shellStyles.spotlightLabel}`}>LIBRARY SIGNAL</p>
              <h2 className={shellStyles.spotlightTitle}>
                {templates.length} template{templates.length === 1 ? "" : "s"} in the library.
              </h2>
              <p className={shellStyles.spotlightText}>
                System templates give you a fast starting point. Personal templates let you capture repeatable style decisions for future launches.
              </p>
              <div className={shellStyles.spotlightBadges}>
                <span className={shellStyles.spotlightBadge}>
                  <Palette className={shellStyles.spotlightBadgeIcon} />
                  Theme presets
                </span>
                <span className={shellStyles.spotlightBadge}>
                  <CreditCard className={shellStyles.spotlightBadgeIcon} />
                  Direct create flow
                </span>
              </div>
            </div>

            <div className={shellStyles.metricGrid}>
              <div className={shellStyles.metricTile}>
                <span className={shellStyles.metricTileLabel}>System</span>
                <span className={shellStyles.metricTileValue}>{systemTemplates.length}</span>
              </div>
              <div className={shellStyles.metricTile}>
                <span className={shellStyles.metricTileLabel}>Public</span>
                <span className={shellStyles.metricTileValue}>{publicCount}</span>
              </div>
            </div>
          </>
        }
        stats={[
          {
            label: "Library",
            value: templates.length,
            hint: "All templates visible to this account.",
          },
          {
            label: "System",
            value: systemTemplates.length,
            hint: "Platform-provided starting points.",
            tone: "violet",
          },
          {
            label: "Personal",
            value: myTemplates.length,
            hint: "Templates created or owned by users.",
            tone: "emerald",
          },
          {
            label: "Public",
            value: publicCount,
            hint: "Templates marked as shareable.",
            tone: "amber",
          },
        ]}
      >
        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.surfaceHeader}>
            <div>
              <p className={`mono ${shellStyles.spotlightLabel}`}>SYSTEM TEMPLATES</p>
              <h2 className={shellStyles.surfaceTitle}>Built-in visual directions</h2>
              <p className={shellStyles.surfaceDescription}>
                Use these as the base layer when you need a fast launch with a pre-built style.
              </p>
            </div>
          </div>

          {systemTemplates.length === 0 ? (
            <div className={shellStyles.emptyState}>
              <div className={shellStyles.emptyIconWrap}>
                <Palette className={shellStyles.emptyIcon} />
              </div>
              <h3 className={shellStyles.emptyTitle}>No system templates yet</h3>
              <p className={shellStyles.emptyText}>
                Once system presets are added, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {systemTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  getBadge={getBadge}
                  getBadgeClass={getBadgeClass}
                  onUse={useTemplate}
                  onDelete={null}
                  deleting={deleting}
                />
              ))}
            </div>
          )}
        </section>

        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.surfaceHeader}>
            <div>
              <p className={`mono ${shellStyles.spotlightLabel}`}>MY TEMPLATES</p>
              <h2 className={shellStyles.surfaceTitle}>Saved personal presets</h2>
              <p className={shellStyles.surfaceDescription}>
                Keep your repeatable design language close and reapply it when creating new cards.
              </p>
            </div>
          </div>

          {myTemplates.length === 0 ? (
            <div className={shellStyles.emptyState}>
              <div className={shellStyles.emptyIconWrap}>
                <Eye className={shellStyles.emptyIcon} />
              </div>
              <h3 className={shellStyles.emptyTitle}>You do not have any templates yet</h3>
              <p className={shellStyles.emptyText}>
                Create your first reusable style preset and it will appear here.
              </p>
              <div className={`${shellStyles.buttonRow} mt-6 justify-center`}>
                <button
                  onClick={() => setModalOpen(true)}
                  className={shellStyles.actionButton}
                >
                  <Plus className={shellStyles.buttonIcon} />
                  Create template
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {myTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  getBadge={getBadge}
                  getBadgeClass={getBadgeClass}
                  onUse={useTemplate}
                  onDelete={deleteTemplate}
                  deleting={deleting}
                  canDelete={template.userId === session?.user?.id}
                />
              ))}
            </div>
          )}
        </section>
      </DashboardShell>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/72 backdrop-blur-md"
          onClick={() => !createLoading && setModalOpen(false)}
        >
          <div
            className={`${shellStyles.surfaceCard} glass-panel w-full max-w-2xl`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={shellStyles.surfaceHeader}>
              <div>
                <p className={`mono ${shellStyles.spotlightLabel}`}>CREATE TEMPLATE</p>
                <h3 className={shellStyles.surfaceTitle}>Capture a reusable visual preset</h3>
                <p className={shellStyles.surfaceDescription}>
                  Save your preferred theme, colors, typography, and corner profile for future cards.
                </p>
              </div>
            </div>

            <form onSubmit={createTemplate} className="space-y-5">
              <label className="block">
                <span className={shellStyles.toolbarHint}>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className={`${shellStyles.toolbarInput} mt-2`}
                  placeholder="My template"
                  required
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block">
                  <span className={shellStyles.toolbarHint}>Theme</span>
                  <select
                    value={form.theme}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        ...applyThemeDefaults(event.target.value),
                      }))
                    }
                    className={`${shellStyles.toolbarSelect} mt-2`}
                  >
                    {THEME_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className={shellStyles.toolbarHint}>Font</span>
                  <select
                    value={form.fontFamily}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        fontFamily: event.target.value,
                      }))
                    }
                    className={`${shellStyles.toolbarSelect} mt-2`}
                  >
                    {FONT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {form.theme === FORMAG_THEME && (
                <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--color-text-muted)]">
                  Formag Corporate keeps its brand colors and rounded geometry fixed.
                </div>
              )}

              {(form.theme === PRG_THEME || form.theme === PRG_ORANGE_THEME) && (
                <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.07] px-4 py-3 text-sm text-cyan-50/80">
                  PRG Tech keeps its palette, typography, and card geometry fixed.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block">
                  <span className={shellStyles.toolbarHint}>Accent color</span>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          accentColor: event.target.value,
                        }))
                      }
                      className="w-14 h-14 rounded-2xl cursor-pointer border border-white/10 bg-transparent"
                    />
                    <input
                      type="text"
                      value={form.accentColor}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          accentColor: event.target.value,
                        }))
                      }
                      className={shellStyles.toolbarInput}
                    />
                  </div>
                </label>

                <label className="block">
                  <span className={shellStyles.toolbarHint}>Background color</span>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="color"
                      value={form.bgColor}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          bgColor: event.target.value,
                        }))
                      }
                      className="w-14 h-14 rounded-2xl cursor-pointer border border-white/10 bg-transparent"
                    />
                    <input
                      type="text"
                      value={form.bgColor}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          bgColor: event.target.value,
                        }))
                      }
                      className={shellStyles.toolbarInput}
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className={shellStyles.toolbarHint}>
                  Corner radius: {form.borderRadius}
                </span>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={form.borderRadius}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      borderRadius: event.target.value,
                    }))
                  }
                  className="mt-3 w-full h-2 bg-[var(--color-bg-base)] rounded-full appearance-none cursor-pointer accent-[var(--color-cyan)]"
                />
              </label>

              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isPublic: event.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-white/10 bg-[var(--color-bg-base)] accent-[var(--color-cyan)]"
                />
                <span className="text-sm text-[var(--color-text-main)]">
                  Public template
                </span>
              </label>

              <div className={`${shellStyles.buttonRow} pt-2 justify-end`}>
                <button
                  type="button"
                  onClick={() => !createLoading && setModalOpen(false)}
                  className={shellStyles.actionButtonGhost}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className={shellStyles.actionButton}
                >
                  {createLoading ? (
                    <Loader2 className={shellStyles.buttonIcon} />
                  ) : (
                    <Plus className={shellStyles.buttonIcon} />
                  )}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function TemplateCard({
  template,
  getBadge,
  getBadgeClass,
  onUse,
  onDelete,
  deleting,
  canDelete = false,
}: {
  template: Template;
  getBadge: (template: Template) => string;
  getBadgeClass: (template: Template) => string;
  onUse: (template: Template) => void;
  onDelete: ((id: string) => void) | null;
  deleting: string | null;
  canDelete?: boolean;
}) {
  const radius = Math.min(parseInt(template.borderRadius || "16", 10), 24);
  const isFormagSystem = template.isSystem && template.theme === FORMAG_THEME;
  const isPrgSystem =
    template.isSystem &&
    (template.theme === PRG_THEME || template.theme === PRG_ORANGE_THEME);

  return (
    <article className={`${shellStyles.surfaceCard} glass-panel`}>
      <div
        className="rounded-[24px] p-5 mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${template.bgColor}, ${template.bgColor}dd)`,
          border: `1px solid ${template.accentColor}25`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${template.accentColor}, transparent 42%)`,
          }}
        />

        <div
          className="relative mx-auto h-28 max-w-[220px] rounded-[28px] border p-4"
          style={{
            backgroundColor: template.bgColor,
            borderColor: template.accentColor,
            borderRadius: `${radius}px`,
            boxShadow: `0 20px 50px ${template.accentColor}22`,
          }}
        >
          {isPrgSystem ? (
            <>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div
                className="relative inline-flex h-8 min-w-[54px] items-center justify-center rounded-2xl border px-3 text-sm font-semibold tracking-[0.18em]"
                style={{
                  color: template.accentColor,
                  borderColor: `${template.accentColor}55`,
                  backgroundColor: `${template.accentColor}12`,
                }}
              >
                PRG
              </div>
              <div className="relative mt-5 space-y-2">
                <div className="h-3 w-28 rounded-full bg-white/75" />
                <div className="h-2.5 w-20 rounded-full bg-white/30" />
                <div
                  className="mt-3 h-9 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${template.accentColor}30, transparent)`,
                    border: `1px solid ${template.accentColor}35`,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: template.accentColor }}
              />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-24 rounded-full bg-white/60" />
                <div className="h-2.5 w-16 rounded-full bg-white/25" />
                <div className="h-2.5 w-20 rounded-full bg-white/18" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{template.name}</h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {THEME_OPTIONS.find((option) => option.value === template.theme)?.label ||
              template.theme}
            {" • "}
            {template.fontFamily}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-[family-name:var(--font-mono)] ${getBadgeClass(template)}`}
        >
          {getBadge(template)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={shellStyles.badge}>Radius {template.borderRadius}</span>
        <span className={shellStyles.badge}>{template.accentColor}</span>
        {isPrgSystem ? (
          <span className={shellStyles.badge}>Precision tech</span>
        ) : null}
      </div>

      <div className={shellStyles.buttonRow}>
        <button onClick={() => onUse(template)} className={shellStyles.actionButton}>
          <CreditCard className={shellStyles.buttonIcon} />
          {isFormagSystem ? "Create card" : "Use template"}
        </button>
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(template.id)}
            disabled={deleting === template.id}
            className={shellStyles.actionButtonDanger}
          >
            {deleting === template.id ? (
              <Loader2 className={shellStyles.buttonIcon} />
            ) : (
              <Trash2 className={shellStyles.buttonIcon} />
            )}
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
