"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Phone,
  Image as ImageIcon,
  MessageSquare,
  Hash,
  Webhook,
  Palette,
  Eye,
  Upload,
  Globe,
  Layers,
} from "lucide-react";

interface CardFormData {
  fullName: string;
  slug: string;
  jobTitle: string;
  company: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
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

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)] text-white font-[family-name:var(--font-geist-mono)] text-sm focus:border-[var(--color-neon)] focus:shadow-[0_0_10px_rgba(0,255,204,0.2)] outline-none transition-all placeholder:text-[var(--color-text-muted)]/50";

const labelClass =
  "block text-xs text-[var(--color-text-muted)] mb-2 font-[family-name:var(--font-geist-mono)] uppercase";

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

  const [form, setForm] = useState<CardFormData>({
    fullName: initialData?.fullName || "",
    slug: initialData?.slug || "",
    jobTitle: initialData?.jobTitle || "",
    company: initialData?.company || "",
    bio: initialData?.bio || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
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
    theme: initialData?.theme || "cyberpunk",
    accentColor: initialData?.accentColor || "#00ffcc",
    bgColor: initialData?.bgColor || "#030305",
    tags: initialData?.tags || [],
    webhookUrl: initialData?.webhookUrl || "",
    customDomain: initialData?.customDomain || "",
  });

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {});

    if (mode === "create") {
      try {
        const saved = localStorage.getItem("cardTemplateSettings");
        if (saved) {
          const tmpl = JSON.parse(saved);
          setForm((prev) => ({
            ...prev,
            theme: tmpl.theme || prev.theme,
            accentColor: tmpl.accentColor || prev.accentColor,
            bgColor: tmpl.bgColor || prev.bgColor,
          }));
          localStorage.removeItem("cardTemplateSettings");
        }
      } catch {
        // ignore
      }
    }
  }, [mode]);

  const updateField = (field: keyof CardFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "fullName" && mode === "create" && !initialData?.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u0400-\u04ff]+/g, "-")
        .replace(/^-|-$/g, "");
      setForm((prev) => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой (макс 5MB)");
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
          setError(data.error || "Ошибка загрузки");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Ошибка загрузки файла");
      setUploading(false);
    }
  };

  const applyTemplate = (template: Template) => {
    setForm((prev) => ({
      ...prev,
      theme: template.theme,
      accentColor: template.accentColor,
      bgColor: template.bgColor,
    }));
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
        setError(data.error || "Ошибка сохранения");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Ошибка сети");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Link>
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Новая визитка" : "Редактирование"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {mode === "edit" && form.slug && (
            <Link
              href={`/card/${form.slug}`}
              target="_blank"
              className="flex items-center gap-2 text-sm border border-[var(--color-border)] px-4 py-2.5 rounded-lg hover:border-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
            >
              <Eye className="w-4 h-4" />
              Превью
            </Link>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--color-neon)] text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-[var(--color-neon-danger)]/10 border border-[var(--color-neon-danger)]/30 text-sm text-[var(--color-neon-danger)] font-[family-name:var(--font-geist-mono)]">
          [ERROR] {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--color-neon)]" />
              Основная информация
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Полное имя *</label>
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
                <label className={labelClass}>Должность</label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => updateField("jobTitle", e.target.value)}
                  className={inputClass}
                  placeholder="Founder & Tech Lead"
                />
              </div>
              <div>
                <label className={labelClass}>Компания</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className={inputClass}
                  placeholder="UntLab"
                />
              </div>
              <div>
                <label className={labelClass}>О себе</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Кратко о себе..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[var(--color-neon)]" />
              Контакты
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Телефон</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+994 50 222 99 95"
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
                <label className={labelClass}>Веб-сайт</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className={inputClass}
                  placeholder="https://ibrahim.az"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-[var(--color-neon)]" />
              Теги, Webhook и Домен
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Теги (через запятую)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className={inputClass}
                  placeholder="Python, n8n, CyberSec"
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Webhook className="w-3 h-3 inline mr-1" />
                  Webhook URL (для CRM)
                </label>
                <input
                  type="url"
                  value={form.webhookUrl}
                  onChange={(e) => updateField("webhookUrl", e.target.value)}
                  className={inputClass}
                  placeholder="https://n8n.example.com/webhook/..."
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Globe className="w-3 h-3 inline mr-1" />
                  Кастомный домен
                </label>
                <input
                  type="text"
                  value={form.customDomain}
                  onChange={(e) => updateField("customDomain", e.target.value)}
                  className={inputClass}
                  placeholder="card.mycompany.com"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Добавьте CNAME запись в DNS вашего домена
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[var(--color-neon)]" />
              Аватар
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Аватар"
                    className="w-20 h-20 rounded-xl object-cover border border-[var(--color-border)]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] flex items-center justify-center">
                    <User className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 text-sm border border-[var(--color-border)] px-4 py-2 rounded-lg hover:border-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)] disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading ? "Загрузка..." : "Загрузить фото"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-[var(--color-text-muted)]">
                    JPG, PNG до 5MB
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Или URL аватара</label>
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

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--color-neon)]" />
              Соцсети
            </h2>
            <div className="space-y-4">
              {[
                { key: "telegram" as const, label: "Telegram", placeholder: "@username" },
                { key: "github" as const, label: "GitHub", placeholder: "https://github.com/username" },
                { key: "linkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                { key: "instagram" as const, label: "Instagram", placeholder: "@username" },
                { key: "facebook" as const, label: "Facebook", placeholder: "https://facebook.com/username" },
                { key: "twitter" as const, label: "Twitter / X", placeholder: "@username" },
                { key: "whatsapp" as const, label: "WhatsApp", placeholder: "+994..." },
                { key: "youtube" as const, label: "YouTube", placeholder: "https://youtube.com/@channel" },
                { key: "tiktok" as const, label: "TikTok", placeholder: "@username" },
              ].map((social) => (
                <div key={social.key}>
                  <label className={labelClass}>{social.label}</label>
                  <input
                    type="text"
                    value={form[social.key]}
                    onChange={(e) => updateField(social.key, e.target.value)}
                    className={inputClass}
                    placeholder={social.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[var(--color-neon)]" />
              Дизайн
            </h2>
            <div className="space-y-4">
              {templates.length > 0 && (
                <div>
                  <label className={labelClass}>
                    <Layers className="w-3 h-3 inline mr-1" />
                    Применить шаблон
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.slice(0, 6).map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className="p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-neon)] transition-all text-left"
                      >
                        <div
                          className="w-full h-6 rounded mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${tmpl.bgColor}, ${tmpl.accentColor}40)`,
                          }}
                        />
                        <p className="text-xs truncate">{tmpl.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>Шаблон</label>
                <select
                  value={form.theme}
                  onChange={(e) => updateField("theme", e.target.value)}
                  className={inputClass}
                >
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="minimal">Минималистичный</option>
                  <option value="gradient">Градиент</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Акцентный цвет</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--color-border)] bg-transparent"
                  />
                  <input
                    type="text"
                    value={form.accentColor}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    className={inputClass}
                    placeholder="#00ffcc"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Цвет фона</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.bgColor}
                    onChange={(e) => updateField("bgColor", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--color-border)] bg-transparent"
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
          </div>
        </div>
      </div>
    </form>
  );
}
