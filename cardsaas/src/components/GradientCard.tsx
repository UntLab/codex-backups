"use client";

import { useState, useCallback } from "react";

interface CardData {
  id: string;
  slug: string;
  fullName: string;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  github?: string | null;
  telegram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  twitter?: string | null;
  theme: string;
  accentColor: string;
  bgColor: string;
  tags: string[];
  webhookUrl?: string | null;
}

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [240, 100, 50];
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function GradientCard({ card }: { card: CardData }) {
  const [copyText, setCopyText] = useState("Copy");
  const [showModal, setShowModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const accent = card.accentColor || "#6366f1";
  const [h, s, l] = hexToHsl(accent);
  const complement = hslToHex((h + 180) % 360, Math.min(s + 20, 100), Math.max(l - 10, 30));
  const gradientBg = `linear-gradient(135deg, ${accent} 0%, ${complement} 100%)`;

  const copyPhone = useCallback(() => {
    if (!card.phone) return;
    navigator.clipboard.writeText(card.phone.replace(/\s/g, "")).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    });
  }, [card.phone]);

  const downloadVCard = useCallback(async () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${card.fullName.split(" ").reverse().join(";")};;;
FN:${card.fullName}
${card.company ? `ORG:${card.company}` : ""}
${card.jobTitle ? `TITLE:${card.jobTitle}` : ""}
${card.phone ? `TEL;TYPE=WORK,VOICE:${card.phone.replace(/\s/g, "")}` : ""}
${card.email ? `EMAIL;TYPE=PREF,INTERNET:${card.email}` : ""}
${card.website ? `URL:${card.website}` : ""}
END:VCARD`.replace(/\n{2,}/g, "\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const file = new File([blob], `${card.slug}.vcf`, { type: "text/vcard" });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: card.fullName });
        return;
      } catch {
        /* fallthrough */
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.slug}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [card]);

  const shareProfile = useCallback(async () => {
    const url = window.location.href;
    const shareData = { title: `${card.fullName} | Digital Card`, text: "Check out my digital business card:", url };
    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }, [card.fullName]);

  const handleLeadSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data: Record<string, string> = {};
      formData.forEach((v, k) => {
        data[k] = v as string;
      });

      if (!data.phone) {
        alert("Phone is required");
        return;
      }

      setSubmitStatus("loading");

      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId: card.id, ...data }),
        });
        setSubmitStatus("done");
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus("idle");
        }, 2000);
      } catch {
        setSubmitStatus("error");
      }
    },
    [card.id]
  );

  const socials = [
    { url: card.github, icon: "fab fa-github" },
    { url: card.telegram, icon: "fab fa-telegram-plane", prefix: "https://t.me/" },
    { url: card.linkedin, icon: "fab fa-linkedin-in" },
    { url: card.facebook, icon: "fab fa-facebook-f" },
    { url: card.instagram, icon: "fab fa-instagram", prefix: "https://instagram.com/" },
    { url: card.twitter, icon: "fab fa-twitter", prefix: "https://twitter.com/" },
    { url: card.youtube, icon: "fab fa-youtube" },
    { url: card.tiktok, icon: "fab fa-tiktok", prefix: "https://tiktok.com/@" },
    { url: card.whatsapp, icon: "fab fa-whatsapp", prefix: "https://wa.me/" },
  ].filter((s) => s.url);

  const getSocialUrl = (social: { url?: string | null; prefix?: string }) => {
    const val = social.url || "";
    if (val.startsWith("http")) return val;
    if (val.startsWith("@")) return (social.prefix || "") + val.slice(1);
    if (val.startsWith("+")) return (social.prefix || "") + val;
    return (social.prefix || "") + val;
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

        .gradient-card-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .gradient-card-page {
          min-height: 100vh;
          background: ${gradientBg};
          font-family: "Inter", sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .gradient-card-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 20% 80%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .gradient-card-container {
          width: 100%;
          max-width: 380px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 36px 28px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          z-index: 1;
        }

        .gradient-card-avatar-wrap {
          width: 110px;
          height: 110px;
          margin: 0 auto 24px;
          padding: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${accent}, ${complement});
          box-shadow: 0 0 30px ${accent}66;
        }

        .gradient-card-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.9);
        }

        .gradient-card-name {
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
        }

        .gradient-card-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 6px;
        }

        .gradient-card-bio {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .gradient-card-phone-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
          overflow: hidden;
        }

        .gradient-card-phone-link {
          flex: 1;
          padding: 14px 18px;
          text-decoration: none;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          text-align: left;
        }

        .gradient-card-copy-btn {
          padding: 14px 18px;
          border: none;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          transition: all 0.3s ease;
        }

        .gradient-card-copy-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .gradient-card-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .gradient-card-tag {
          font-size: 12px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .gradient-card-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .gradient-card-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .gradient-card-btn-primary {
          background: linear-gradient(135deg, ${accent}, ${complement});
          color: #ffffff;
          box-shadow: 0 8px 24px ${accent}66;
        }

        .gradient-card-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px ${accent}99;
        }

        .gradient-card-btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.35);
        }

        .gradient-card-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .gradient-card-socials {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .gradient-card-social-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .gradient-card-social-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .gradient-card-email-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: all 0.3s ease;
        }

        .gradient-card-email-link:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .gradient-card-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 9999;
        }

        .gradient-card-modal-content {
          background: rgba(30, 30, 40, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 28px 24px;
          width: 100%;
          max-width: 400px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          max-height: 85vh;
          overflow-y: auto;
        }

        .gradient-card-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .gradient-card-modal-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 24px;
        }

        .gradient-card-input {
          width: 100%;
          padding: 14px 18px;
          margin-bottom: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-size: 14px;
          font-family: "Inter", sans-serif;
          outline: none;
          transition: border-color 0.3s;
        }

        .gradient-card-input:focus {
          border-color: ${accent};
          box-shadow: 0 0 0 3px ${accent}33;
        }

        .gradient-card-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div className="gradient-card-page">
        <div className="gradient-card-container">
          {card.avatarUrl && (
            <div className="gradient-card-avatar-wrap">
              <img src={card.avatarUrl} alt={card.fullName} className="gradient-card-avatar" />
            </div>
          )}

          <h1 className="gradient-card-name">{card.fullName}</h1>

          {(card.jobTitle || card.company) && (
            <p className="gradient-card-subtitle">
              {[card.jobTitle, card.company].filter(Boolean).join(" · ")}
            </p>
          )}

          {card.bio && <p className="gradient-card-bio">{card.bio}</p>}

          {card.phone && (
            <div className="gradient-card-phone-row">
              <a href={`tel:${card.phone.replace(/\s/g, "")}`} className="gradient-card-phone-link">
                {card.phone}
              </a>
              <button className="gradient-card-copy-btn" onClick={copyPhone}>
                {copyText}
              </button>
            </div>
          )}

          {card.tags.length > 0 && (
            <div className="gradient-card-tags">
              {card.tags.map((tag) => (
                <span key={tag} className="gradient-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="gradient-card-actions">
            <button className="gradient-card-btn gradient-card-btn-primary" onClick={downloadVCard}>
              <i className="fas fa-download" /> Save Contact
            </button>
            {card.webhookUrl && (
              <button
                className="gradient-card-btn gradient-card-btn-secondary"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-share-alt" /> Share Your Data
              </button>
            )}
            <button className="gradient-card-btn gradient-card-btn-secondary" onClick={shareProfile}>
              <i className="fas fa-paper-plane" /> Send This Profile
            </button>
          </div>

          {socials.length > 0 && (
            <div className="gradient-card-socials">
              {socials.map((s) => (
                <a
                  key={s.icon}
                  href={getSocialUrl(s)}
                  className="gradient-card-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          )}

          {card.email && (
            <a href={`mailto:${card.email}`} className="gradient-card-email-link">
              <i className="fas fa-envelope" />
              {card.email}
            </a>
          )}
        </div>

        {showModal && (
          <div
            className="gradient-card-modal"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="gradient-card-modal-content">
              <h2 className="gradient-card-modal-title">Share Your Data</h2>
              <p className="gradient-card-modal-desc">Enter your contact information to connect.</p>
              <form onSubmit={handleLeadSubmit}>
                <input name="name" placeholder="Full Name" className="gradient-card-input" />
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  className="gradient-card-input"
                  required
                />
                <input name="email" placeholder="Email" type="email" className="gradient-card-input" />
                <input name="telegram" placeholder="Telegram" className="gradient-card-input" />
                <input name="whatsapp" placeholder="WhatsApp" className="gradient-card-input" />
                <input name="linkedin" placeholder="LinkedIn" className="gradient-card-input" />
                <input name="instagram" placeholder="Instagram" className="gradient-card-input" />
                <input name="facebook" placeholder="Facebook" className="gradient-card-input" />
                <button
                  type="submit"
                  className="gradient-card-btn gradient-card-btn-primary"
                  style={{ marginTop: 8 }}
                >
                  {submitStatus === "loading"
                    ? "Sending..."
                    : submitStatus === "done"
                      ? "Done!"
                      : submitStatus === "error"
                        ? "Error"
                        : "Submit"}
                </button>
                <button
                  type="button"
                  className="gradient-card-btn gradient-card-btn-secondary"
                  style={{ marginTop: 8 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
