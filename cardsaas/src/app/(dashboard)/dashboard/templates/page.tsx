"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  LogOut,
  Palette,
  Plus,
  Trash2,
  Eye,
  Copy,
  Loader2,
} from "lucide-react";

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
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Roboto", label: "Roboto" },
];

const inputClass = "v2-input-compact";

const labelClass = "v2-label";

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [useToast, setUseToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    theme: "cyberpunk",
    accentColor: "#00ffcc",
    bgColor: "#030305",
    fontFamily: "Inter",
    borderRadius: "16",
    isPublic: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTemplates();
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
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const useTemplate = (t: Template) => {
    const settings = {
      theme: t.theme,
      accentColor: t.accentColor,
      bgColor: t.bgColor,
      fontFamily: t.fontFamily,
      borderRadius: t.borderRadius,
    };
    try {
      localStorage.setItem("cardTemplateSettings", JSON.stringify(settings));
      setUseToast(t.id);
      setTimeout(() => setUseToast(null), 2500);
    } catch {
      alert("Template copied. Apply it when creating a new card.");
    }
  };

  const createTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const systemTemplates = templates.filter((t) => t.isSystem);
  const myTemplates = templates.filter((t) => !t.isSystem);

  const getBadge = (t: Template) => {
    if (t.isSystem) return "System";
    if (t.isPublic) return "Public";
    return "Private";
  };

  const getBadgeClass = (t: Template) => {
    if (t.isSystem) return "bg-[var(--color-neon)]/20 text-[var(--color-neon)] border-[var(--color-neon)]/40";
    if (t.isPublic) return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    return "bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)] border-[var(--color-border)]";
  };

  if (status === "loading" || loading) {
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
              Dashboard
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1 font-[family-name:var(--font-geist-mono)]">
              Card Templates
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
              Browse and manage reusable design templates
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="v2-button-compact text-sm font-[family-name:var(--font-geist-mono)]"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* System templates */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-geist-mono)] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[var(--color-neon)]" />
            System Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemTemplates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                getBadge={getBadge}
                getBadgeClass={getBadgeClass}
                onUse={useTemplate}
                onDelete={null}
                deleting={deleting}
                useToast={useToast}
              />
            ))}
          </div>
          {systemTemplates.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)] py-4">
              No system templates available yet
            </p>
          )}
        </section>

        {/* My templates */}
        <section>
          <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-geist-mono)] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--color-neon)]" />
            My Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTemplates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                getBadge={getBadge}
                getBadgeClass={getBadgeClass}
                onUse={useTemplate}
                onDelete={deleteTemplate}
                deleting={deleting}
                useToast={useToast}
                canDelete={t.userId === session?.user?.id}
              />
            ))}
          </div>
          {myTemplates.length === 0 && (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
              <Palette className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)] mb-4">
                You do not have any templates yet
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="v2-button-compact text-sm font-[family-name:var(--font-geist-mono)]"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Create template modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !createLoading && setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6 font-[family-name:var(--font-geist-mono)]">
              Create Template
            </h3>
            <form onSubmit={createTemplate} className="space-y-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  placeholder="My template"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Theme</label>
                <select
                  value={form.theme}
                  onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
                  className={inputClass}
                >
                  {THEME_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-[var(--color-border)] bg-transparent"
                    />
                    <input
                      type="text"
                      value={form.accentColor}
                      onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
                      className={`${inputClass} flex-1`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.bgColor}
                      onChange={(e) => setForm((f) => ({ ...f, bgColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-[var(--color-border)] bg-transparent"
                    />
                    <input
                      type="text"
                      value={form.bgColor}
                      onChange={(e) => setForm((f) => ({ ...f, bgColor: e.target.value }))}
                      className={`${inputClass} flex-1`}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Font</label>
                <select
                  value={form.fontFamily}
                  onChange={(e) => setForm((f) => ({ ...f, fontFamily: e.target.value }))}
                  className={inputClass}
                >
                  {FONT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Corner Radius: {form.borderRadius}
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={form.borderRadius}
                  onChange={(e) => setForm((f) => ({ ...f, borderRadius: e.target.value }))}
                  className="w-full h-2 bg-[var(--color-bg-base)] rounded-lg appearance-none cursor-pointer accent-[var(--color-neon)]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
                  className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-bg-base)] accent-[var(--color-neon)]"
                />
                <span className="text-sm font-[family-name:var(--font-geist-mono)]">
                  Public template
                </span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="v2-button-compact flex-1 text-sm font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
                >
                  {createLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => !createLoading && setModalOpen(false)}
                  className="v2-link-button text-sm font-[family-name:var(--font-geist-mono)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template: t,
  getBadge,
  getBadgeClass,
  onUse,
  onDelete,
  deleting,
  useToast,
  canDelete = false,
}: {
  template: Template;
  getBadge: (t: Template) => string;
  getBadgeClass: (t: Template) => string;
  onUse: (t: Template) => void;
  onDelete: ((id: string) => void) | null;
  deleting: string | null;
  useToast: string | null;
  canDelete?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-neon)]/50 transition-all group">
      {/* Mini preview */}
      <div
        className="h-24 flex items-center justify-center relative"
        style={{
          background: t.bgColor,
          borderBottom: `3px solid ${t.accentColor}`,
        }}
      >
        <div
          className="w-16 h-10 rounded-md border-2"
          style={{
            backgroundColor: t.bgColor,
            borderColor: t.accentColor,
            borderRadius: `${Math.min(parseInt(t.borderRadius || "16", 10), 24)}px`,
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold font-[family-name:var(--font-geist-mono)]">
            {t.name}
          </h3>
          <span
            className={`text-[10px] px-2 py-0.5 rounded border font-[family-name:var(--font-geist-mono)] ${getBadgeClass(t)}`}
          >
            {getBadge(t)}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)] mb-4">
          {THEME_OPTIONS.find((o) => o.value === t.theme)?.label || t.theme}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUse(t)}
            className="flex items-center gap-1 text-xs bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/30 text-[var(--color-neon)] px-3 py-2 rounded-md hover:bg-[var(--color-neon)] hover:text-black transition-all font-[family-name:var(--font-geist-mono)]"
          >
            {useToast === t.id ? (
              <>
                <Copy className="w-3 h-3" />
                Copied! Apply it when creating a new card
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Use Template
              </>
            )}
          </button>
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(t.id)}
              disabled={deleting === t.id}
              className="flex items-center gap-1 text-xs bg-[var(--color-bg-base)] border border-[var(--color-border)] px-3 py-2 rounded-md hover:border-[var(--color-neon-danger)] hover:text-[var(--color-neon-danger)] transition-colors ml-auto"
            >
              {deleting === t.id ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
