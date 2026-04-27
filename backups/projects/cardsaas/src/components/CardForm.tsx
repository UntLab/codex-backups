"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Image as ImageIcon,
  MessageSquare,
  Hash,
  Webhook,
  Eye,
  Upload,
  Globe,
  Layers,
} from "lucide-react";
import {
  applyFormagThemeDefaults,
  FORMAG_COMPANY,
  FORMAG_DEFAULT_OFFICE_ADDRESS,
  FORMAG_SITE_LABEL,
  FORMAG_THEME,
  isFormagCorporateTheme,
} from "@/lib/formag";
import {
  applyPrgThemeDefaults,
  isPrgTechTheme,
  PRG_COMPANY,
  PRG_DEFAULT_OFFICE_ADDRESS,
  PRG_SITE_LABEL,
  PRG_ORANGE_THEME,
  PRG_THEME,
} from "@/lib/prg";

interface CardFormData {
  fullName: string;
  slug: string;
  jobTitle: string;
  company: string;
  bio: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  website: string;
  officeAddress: string;
  avatarUrl: string;
  github: string;
  telegram: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  theme: string;
  accentColor: string;
  bgColor: string;
  tags: string[];
  webhookUrl: string;
  customDomain: string;
}

interface Template {
  id: string;
  name: string;
  theme: string;
  accentColor: string;
  bgColor: string;
  fontFamily: string;
  isSystem: boolean;
}

interface CardFormProps {
  initialData?: Partial<CardFormData>;
  cardId?: string;
  mode: "create" | "edit";
}

type SavedTemplateSettings = Partial<
  Pick<CardFormData, "theme" | "accentColor" | "bgColor">
>;

interface SavedTemplateMeta {
  id: string;
  name: string;
  theme: string;
  isSystem?: boolean;
}

const inputClass = "v2-input";

const labelClass = "v2-label";

export default function CardForm({ initialData, cardId, mode }: CardFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );
  const [savedTemplateSettings] = useState<SavedTemplateSettings | null>(() => {
    if (mode !== "create" || typeof window === "undefined") return null;

    try {
      const saved = localStorage.getItem("cardTemplateSettings");
      return saved ? (JSON.parse(saved) as SavedTemplateSettings) : null;
    } catch {
      return null;
    }
  });
  const [savedTemplateMeta] = useState<SavedTemplateMeta | null>(() => {
    if (mode !== "create" || typeof window === "undefined") return null;

    try {
      const saved = localStorage.getItem("cardTemplateMeta");
      return saved ? (JSON.parse(saved) as SavedTemplateMeta) : null;
    } catch {
      return null;
    }
  });

  const normalizeFormState = (nextForm: CardFormData): CardFormData =>
    applyPrgThemeDefaults(applyFormagThemeDefaults(nextForm));

  const [form, setForm] = useState<CardFormData>(() =>
    normalizeFormState({
      fullName: initialData?.fullName || "",
      slug: initialData?.slug || "",
      jobTitle: initialData?.jobTitle || "",
      company: initialData?.company || "",
      bio: initialData?.bio || "",
      phone: initialData?.phone || "",
      secondaryPhone: initialData?.secondaryPhone || "",
      email: initialData?.email || "",
      website: initialData?.website || "",
      officeAddress: initialData?.officeAddress || "",
      avatarUrl: initialData?.avatarUrl || "",
      github: initialData?.github || "",
      telegram: initialData?.telegram || "",
      linkedin: initialData?.linkedin || "",
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
      whatsapp: initialData?.whatsapp || "",
      tiktok: initialData?.tiktok || "",
      youtube: initialData?.youtube || "",
      twitter: initialData?.twitter || "",
      theme: savedTemplateSettings?.theme || initialData?.theme || "cyberpunk",
      accentColor:
        savedTemplateSettings?.accentColor || initialData?.accentColor || "#00ffcc",
      bgColor:
        savedTemplateSettings?.bgColor || initialData?.bgColor || "#030305",
      tags: initialData?.tags || [],
      webhookUrl: initialData?.webhookUrl || "",
      customDomain: initialData?.customDomain || "",
    })
  );

  const isFormagTheme = isFormagCorporateTheme(form.theme);
  const isPrgTheme = isPrgTechTheme(form.theme);
  const isFixedBrandTheme = isFormagTheme || isPrgTheme;
  const fixedCompanyLabel = isFormagTheme
    ? FORMAG_COMPANY
    : isPrgTheme
      ? PRG_COMPANY
      : "";
  const fixedWebsiteLabel = isFormagTheme
    ? FORMAG_SITE_LABEL
    : isPrgTheme
      ? PRG_SITE_LABEL
      : "";
  const officeAddressPlaceholder = isPrgTheme
    ? PRG_DEFAULT_OFFICE_ADDRESS
    : FORMAG_DEFAULT_OFFICE_ADDRESS;
  const previewHref = form.slug ? `/card/${form.slug}` : null;

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {});

    if (mode === "create" && (savedTemplateSettings || savedTemplateMeta)) {
      try {
        localStorage.removeItem("cardTemplateSettings");
        localStorage.removeItem("cardTemplateMeta");
      } catch {
        // ignore
      }
    }
  }, [mode, savedTemplateMeta, savedTemplateSettings]);

  const updateField = (field: keyof CardFormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "fullName" && mode === "create" && !initialData?.slug) {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\u0400-\u04ff]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      if (field === "theme") {
        return normalizeFormState(next);
      }

      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5MB)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        if (res.ok) {
          setForm((prev) => ({ ...prev, avatarUrl: data.url }));
        } else {
          setError(data.error || "Upload failed");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("File upload failed");
      setUploading(false);
    }
  };

  const applyTemplate = (template: Template) => {
    setForm((prev) =>
      normalizeFormState({
        ...prev,
        theme: template.theme,
        accentColor: template.accentColor,
        bgColor: template.bgColor,
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...form, tags };

    try {
      const url = mode === "edit" ? `/api/cards/${cardId}` : "/api/cards";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Save failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_360px]">
        <div className="space-y-6">
          <section className="glass-panel rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.24)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mono text-[11px] uppercase tracking-[0.34em] text-[var(--color-text-dim)]">
                  {mode === "create" ? "CREATE FLOW" : "EDIT FLOW"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--color-text-main)] sm:text-4xl">
                  {isFormagTheme
                    ? "Publish a fixed corporate card without touching the brand system."
                    : isPrgTheme
                      ? "Shape a precision-tech profile that stays locked to the PRG brand system."
                    : mode === "create"
                      ? "Build the card locally, then ship only when the flow feels right."
                      : "Refine the card locally before the next clean release."}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
                  {isFormagTheme
                    ? "Formag Corporate keeps the company, website, colors, and back side fixed. We only edit employee-specific fields here."
                    : isPrgTheme
                      ? "PRG Tech keeps the company, website, colors, and tech geometry fixed. We only edit the person-specific layer here."
                    : "This builder is now tuned for local iteration first, so we can simplify the experience and clean up the launch logic before pushing anything upstream."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="v2-link-button text-sm font-[family-name:var(--font-geist-mono)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                {previewHref ? (
                  <Link
                    href={previewHref}
                    target="_blank"
                    className="v2-link-button text-sm font-[family-name:var(--font-geist-mono)]"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="v2-button-compact text-sm font-[family-name:var(--font-geist-mono)]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading
                    ? "Saving..."
                    : mode === "create"
                      ? "Create card"
                      : "Save changes"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-dim)]">
                  Route
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-main)]">
                  {form.slug ? `/card/${form.slug}` : "Will be generated from the name"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-dim)]">
                  Theme
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-main)]">
                  {form.theme}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-dim)]">
                  Publish mode
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-main)]">
                  Manual approval
                </p>
              </div>
            </div>
          </section>

          {error ? (
            <div className="rounded-2xl border border-[var(--color-neon-danger)]/30 bg-[var(--color-neon-danger)]/10 px-4 py-3 text-sm text-[var(--color-neon-danger)]">
              [ERROR] {error}
            </div>
          ) : null}

          {mode === "create" && savedTemplateMeta ? (
            <section className="glass-panel rounded-[28px] border border-emerald-400/20 bg-emerald-400/[0.08] p-5 shadow-[0_18px_45px_rgba(16,185,129,0.14)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[0.28em] text-emerald-200/80">
                    TEMPLATE FLOW
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {savedTemplateMeta.name} is already applied.
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-emerald-50/80">
                    {isFormagTheme
                      ? "This is now a guided Formag creation flow. Fill in the employee data below and save the card."
                      : isPrgTheme
                        ? "This is now a guided PRG creation flow. Fill in the specialist data below and save the card."
                      : "This builder opened with your selected template pre-applied. You can start filling the card immediately."}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-[family-name:var(--font-geist-mono)] uppercase tracking-[0.24em] text-emerald-100">
                  {savedTemplateMeta.isSystem ? "System template" : "Saved template"}
                </span>
              </div>
            </section>
          ) : null}

          <section className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)] sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                  Theme and layout
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
                  Pick the presentation layer first. For system templates like Formag or PRG, the builder automatically locks the brand pieces that should never drift.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {templates.length > 0 ? (
                <div>
                  <label className={labelClass}>
                    <Layers className="mr-1 inline h-3 w-3" />
                    Apply Template
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {templates.slice(0, 6).map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          form.theme === tmpl.theme
                            ? "border-[var(--color-neon)] bg-[rgba(14,165,233,0.08)] shadow-[0_18px_45px_rgba(14,165,233,0.14)]"
                            : "border-white/10 bg-black/10 hover:border-[var(--color-neon)]/50 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className="mb-3 h-10 w-full rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${tmpl.bgColor}, ${tmpl.accentColor}40)`,
                          }}
                        />
                        <p className="text-sm font-medium text-[var(--color-text-main)]">
                          {tmpl.name}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {tmpl.isSystem ? "System template" : "Saved template"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className={labelClass}>Theme</label>
                  <select
                    value={form.theme}
                    onChange={(e) => updateField("theme", e.target.value)}
                    className={inputClass}
                  >
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="minimal">Minimal</option>
                    <option value="gradient">Gradient</option>
                    <option value={PRG_THEME}>PRG Tech</option>
                    <option value={PRG_ORANGE_THEME}>PRG Tech Orange</option>
                    <option value={FORMAG_THEME}>Formag Corporate</option>
                  </select>
                </div>

                {isFixedBrandTheme ? (
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-sm text-amber-100">
                    {isFormagTheme
                      ? "Formag Corporate keeps the brand colors, company, and website fixed. This screen stays focused on employee data, routing, and launch readiness."
                      : "PRG Tech keeps the brand colors, company, and website fixed. This screen stays focused on personal data, routing, and launch readiness."}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={form.accentColor}
                          onChange={(e) =>
                            updateField("accentColor", e.target.value)
                          }
                          className="h-10 w-10 cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.accentColor}
                          onChange={(e) =>
                            updateField("accentColor", e.target.value)
                          }
                          className={inputClass}
                          placeholder="#00ffcc"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Background Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={form.bgColor}
                          onChange={(e) => updateField("bgColor", e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.bgColor}
                          onChange={(e) => updateField("bgColor", e.target.value)}
                          className={inputClass}
                          placeholder="#030305"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)] sm:p-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                Identity
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                Fill in the person-specific details that shape the public card.
              </p>
            </div>

            <div
              className={`mt-6 grid gap-5 ${
                isFixedBrandTheme
                  ? "xl:grid-cols-[300px_minmax(0,1fr)]"
                  : "lg:grid-cols-2"
              }`}
            >
              {isFixedBrandTheme ? (
                <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-main)]">
                    <ImageIcon className="h-4 w-4 text-[var(--color-neon)]" />
                    Profile Photo
                  </h4>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-4">
                      {form.avatarUrl ? (
                        <img
                          src={form.avatarUrl}
                          alt="Avatar"
                          className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[var(--color-bg-base)]">
                          <User className="h-8 w-8 text-[var(--color-text-muted)]" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="v2-link-button text-sm font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {isFormagTheme
                            ? "This image becomes the main portrait area at the top of the vertical Formag card."
                            : "This image becomes the hero portrait at the top of the vertical PRG card."}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Photo URL</label>
                      <input
                        type="url"
                        value={form.avatarUrl}
                        onChange={(e) => updateField("avatarUrl", e.target.value)}
                        className={inputClass}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {isFixedBrandTheme ? (
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="Israfil Ibrahim"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input
                        type="text"
                        value={form.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                        className={inputClass}
                        placeholder="IT Manager"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-[var(--color-text-main)]">
                    <p className="mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-dim)]">
                      Fixed company identity
                    </p>
                    <p className="mt-3 text-base font-medium text-[var(--color-text-main)]">
                      {fixedCompanyLabel}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {isFormagTheme
                        ? "Brand, colors, website, and reverse side stay locked by the Formag Corporate template."
                        : "Brand, colors, website, and reverse side stay locked by the PRG Tech template."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      required
                      className={inputClass}
                      placeholder="Israfil Ibrahim"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input
                      type="text"
                      value={form.jobTitle}
                      onChange={(e) => updateField("jobTitle", e.target.value)}
                      className={inputClass}
                      placeholder="IT Manager"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      className={inputClass}
                      placeholder="UntLab"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className={labelClass}>About</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      className={`${inputClass} resize-none`}
                      rows={4}
                      placeholder="A short bio..."
                    />
                  </div>
                </>
              )}

            </div>
          </section>

          <section className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)] sm:p-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                Contact and office details
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                These fields drive both the public card and the downloadable contact profile.
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <label className={labelClass}>
                  {isFixedBrandTheme ? "Primary Phone" : "Phone"}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+994 50 222 99 95"
                />
              </div>
              <div>
                <label className={labelClass}>Secondary Phone</label>
                <input
                  type="tel"
                  value={form.secondaryPhone}
                  onChange={(e) =>
                    updateField("secondaryPhone", e.target.value)
                  }
                  className={inputClass}
                  placeholder="+994 12 310 03 30"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass}
                  placeholder="israfil@ibrahim.az"
                />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                {isFixedBrandTheme ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-[var(--color-text-main)]">
                    {fixedWebsiteLabel}
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {isFormagTheme
                        ? "Fixed by the Formag Corporate template."
                        : "Fixed by the PRG Tech template."}
                    </p>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className={inputClass}
                    placeholder="https://ibrahim.az"
                  />
                )}
              </div>
              <div className="lg:col-span-2">
                <label className={labelClass}>Office Address</label>
                <textarea
                  value={form.officeAddress}
                  onChange={(e) =>
                    updateField("officeAddress", e.target.value)
                  }
                  className={`${inputClass} resize-y`}
                  rows={4}
                  placeholder={officeAddressPlaceholder}
                />
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)] sm:p-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                Publishing and routing
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                After save, the card appears in Dashboard. Activate it there, then open the live route and share the public link or QR.
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <label className={labelClass}>URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                    /card/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className={inputClass}
                    placeholder="israfil-ibrahim"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <Globe className="mr-1 inline h-3 w-3" />
                  Custom Domain
                </label>
                <input
                  type="text"
                  value={form.customDomain}
                  onChange={(e) => updateField("customDomain", e.target.value)}
                  className={inputClass}
                  placeholder="card.mycompany.com"
                />
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Optional. Add a CNAME in DNS only when you are ready for domain mapping.
                </p>
              </div>
            </div>
          </section>

          <details className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)] sm:p-8">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                    Advanced options
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                    Keep the main flow clean. Open this only when you need richer profile data, CRM hooks, or extra social surfaces.
                  </p>
                </div>
                <span className="mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-text-dim)]">
                  Expand
                </span>
              </div>
            </summary>

            <div className="mt-6 space-y-6">
              <div className="grid gap-6 xl:grid-cols-2">
                  {!isFixedBrandTheme ? (
                  <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
                    <h4 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-main)]">
                      <ImageIcon className="h-4 w-4 text-[var(--color-neon)]" />
                      Avatar
                    </h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-4">
                        {form.avatarUrl ? (
                          <img
                            src={form.avatarUrl}
                            alt="Avatar"
                            className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[var(--color-bg-base)]">
                            <User className="h-8 w-8 text-[var(--color-text-muted)]" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="v2-link-button text-sm font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
                          >
                            {uploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {uploading ? "Uploading..." : "Upload Photo"}
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <p className="text-xs text-[var(--color-text-muted)]">
                            JPG or PNG up to 5MB.
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Or avatar URL</label>
                        <input
                          type="url"
                          value={form.avatarUrl}
                          onChange={(e) => updateField("avatarUrl", e.target.value)}
                          className={inputClass}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>
                  </div>
                  ) : null}

                  {!isFixedBrandTheme ? (
                  <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
                    <h4 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-main)]">
                      <MessageSquare className="h-4 w-4 text-[var(--color-neon)]" />
                      Socials
                    </h4>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          key: "telegram" as const,
                          label: "Telegram",
                          placeholder: "@username",
                        },
                        {
                          key: "github" as const,
                          label: "GitHub",
                          placeholder: "https://github.com/username",
                        },
                        {
                          key: "linkedin" as const,
                          label: "LinkedIn",
                          placeholder: "https://linkedin.com/in/username",
                        },
                        {
                          key: "instagram" as const,
                          label: "Instagram",
                          placeholder: "@username",
                        },
                        {
                          key: "facebook" as const,
                          label: "Facebook",
                          placeholder: "https://facebook.com/username",
                        },
                        {
                          key: "twitter" as const,
                          label: "Twitter / X",
                          placeholder: "@username",
                        },
                        {
                          key: "whatsapp" as const,
                          label: "WhatsApp",
                          placeholder: "+994...",
                        },
                        {
                          key: "youtube" as const,
                          label: "YouTube",
                          placeholder: "https://youtube.com/@channel",
                        },
                        {
                          key: "tiktok" as const,
                          label: "TikTok",
                          placeholder: "@username",
                        },
                      ].map((social) => (
                        <div
                          key={social.key}
                          className={social.key === "tiktok" ? "sm:col-span-2" : ""}
                        >
                          <label className={labelClass}>{social.label}</label>
                          <input
                            type="text"
                            value={form[social.key]}
                            onChange={(e) =>
                              updateField(social.key, e.target.value)
                            }
                            className={inputClass}
                            placeholder={social.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  ) : (
                  <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
                    <h4 className="text-base font-semibold text-[var(--color-text-main)]">
                      Formag Note
                    </h4>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                      Formag now uses a vertical mobile-first layout with a photo space at the top. Keep the image clean and tightly cropped for the best result.
                    </p>
                  </div>
                  )}
                </div>

              <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
                <h4 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-main)]">
                  <Hash className="h-4 w-4 text-[var(--color-neon)]" />
                  Internal metadata
                </h4>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className={labelClass}>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className={inputClass}
                      placeholder="Sales, Logistics, VIP"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Webhook className="mr-1 inline h-3 w-3" />
                      Webhook URL (for CRM)
                    </label>
                    <input
                      type="url"
                      value={form.webhookUrl}
                      onChange={(e) =>
                        updateField("webhookUrl", e.target.value)
                      }
                      className={inputClass}
                      placeholder="https://n8n.example.com/webhook/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)]">
            <p className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
              Local summary
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--color-text-main)]">
              {form.fullName || "Untitled card"}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              {form.jobTitle || "Role not set yet"}
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <p className="mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-dim)]">
                  Public route
                </p>
                <p className="mt-2 break-all text-sm text-[var(--color-text-main)]">
                  {previewHref || "Will appear after slug is set"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <p className="mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-dim)]">
                  Contact payload
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-main)]">
                  Save Contact and QR use the same vCard source.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <p className="mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-dim)]">
                  Local status
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-main)]">
                  Changes stay local until we choose to ship them.
                </p>
              </div>
            </div>
          </section>

          {isFixedBrandTheme ? (
            <section className="glass-panel rounded-[28px] border border-amber-400/20 bg-[rgba(251,191,36,0.08)] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)]">
              <p className="mono text-[11px] uppercase tracking-[0.3em] text-amber-100/80">
                {isFormagTheme ? "Formag rules" : "PRG rules"}
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-50">
                <li>Company is fixed to {fixedCompanyLabel}.</li>
                <li>Website is fixed to {fixedWebsiteLabel}.</li>
                <li>Office address stays editable per employee.</li>
                <li>QR always leads directly to the contact file.</li>
                <li>Front opens first on mobile, back stays one tap away.</li>
              </ul>
            </section>
          ) : (
            <section className="glass-panel rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.18)]">
              <p className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-dim)]">
                Builder note
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                The main flow now stays short. Less-used knobs like socials, CRM webhooks, and extra profile surfaces live under Advanced options so the core publishing flow stays readable.
              </p>
            </section>
          )}
        </aside>
      </div>
    </form>
  );
}
