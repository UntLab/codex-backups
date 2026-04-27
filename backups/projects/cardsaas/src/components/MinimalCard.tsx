"use client";

import { useState, useCallback } from "react";
import { downloadCardContact } from "@/lib/card-contact";

interface CardData {
  id: string;
  slug: string;
  fullName: string;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  phone?: string | null;
  secondaryPhone?: string | null;
  email?: string | null;
  website?: string | null;
  officeAddress?: string | null;
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

export default function MinimalCard({ card }: { card: CardData }) {
  const [copyText, setCopyText] = useState("Copy");
  const [showModal, setShowModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const accent = card.accentColor || "#007aff";
  const bg = card.bgColor || "#f5f5f7";

  const copyPhone = useCallback(() => {
    if (!card.phone) return;
    navigator.clipboard.writeText(card.phone.replace(/\s/g, "")).then(() => {
      setCopyText("Copied");
      setTimeout(() => setCopyText("Copy"), 2000);
    });
  }, [card.phone]);

  const downloadVCard = useCallback(async () => {
    await downloadCardContact(card);
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
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

        .minimal-card-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .minimal-card-page {
          min-height: 100vh;
          background-color: ${bg};
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
        }

        .minimal-card-container {
          width: 100%;
          max-width: 380px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e5e5ea;
          padding: 32px 28px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .minimal-card-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 20px;
          display: block;
          border: 2px solid #e5e5ea;
        }

        .minimal-card-name {
          font-size: 22px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 6px;
        }

        .minimal-card-subtitle {
          font-size: 14px;
          color: #6e6e73;
          margin-bottom: 4px;
        }

        .minimal-card-bio {
          font-size: 14px;
          color: #424245;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .minimal-card-phone-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f5f5f7;
          border-radius: 12px;
          border: 1px solid #e5e5ea;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .minimal-card-phone-link {
          flex: 1;
          padding: 14px 16px;
          text-decoration: none;
          color: #1d1d1f;
          font-size: 15px;
          font-weight: 500;
          text-align: left;
        }

        .minimal-card-copy-btn {
          padding: 14px 16px;
          border: none;
          border-left: 1px solid #e5e5ea;
          background: transparent;
          color: ${accent};
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: "Inter", sans-serif;
        }

        .minimal-card-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .minimal-card-tag {
          font-size: 12px;
          padding: 6px 12px;
          background: #f5f5f7;
          color: #6e6e73;
          border-radius: 20px;
          border: 1px solid #e5e5ea;
        }

        .minimal-card-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .minimal-card-btn {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid #e5e5ea;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #1d1d1f;
        }

        .minimal-card-btn-primary {
          background: ${accent};
          color: #ffffff;
          border-color: ${accent};
        }

        .minimal-card-socials {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .minimal-card-social-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f5f5f7;
          border: 1px solid #e5e5ea;
          color: #6e6e73;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 18px;
        }

        .minimal-card-social-btn:hover {
          color: ${accent};
          border-color: ${accent};
        }

        .minimal-card-email-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: ${accent};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .minimal-card-email-link:hover {
          text-decoration: underline;
        }

        .minimal-card-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 9999;
        }

        .minimal-card-modal-content {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 24px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #e5e5ea;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          max-height: 85vh;
          overflow-y: auto;
        }

        .minimal-card-modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 6px;
        }

        .minimal-card-modal-desc {
          font-size: 13px;
          color: #6e6e73;
          margin-bottom: 20px;
        }

        .minimal-card-input {
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 12px;
          border-radius: 10px;
          border: 1px solid #e5e5ea;
          background: #f5f5f7;
          font-size: 14px;
          font-family: "Inter", sans-serif;
          outline: none;
        }

        .minimal-card-input:focus {
          border-color: ${accent};
        }

        .minimal-card-input::placeholder {
          color: #8e8e93;
        }
      `}</style>

      <div className="minimal-card-page">
        <div className="minimal-card-container">
          {card.avatarUrl && (
            <img src={card.avatarUrl} alt={card.fullName} className="minimal-card-avatar" />
          )}

          <h1 className="minimal-card-name">{card.fullName}</h1>

          {(card.jobTitle || card.company) && (
            <p className="minimal-card-subtitle">
              {[card.jobTitle, card.company].filter(Boolean).join(" · ")}
            </p>
          )}

          {card.bio && <p className="minimal-card-bio">{card.bio}</p>}

          {card.phone && (
            <div className="minimal-card-phone-row">
              <a href={`tel:${card.phone.replace(/\s/g, "")}`} className="minimal-card-phone-link">
                {card.phone}
              </a>
              <button className="minimal-card-copy-btn" onClick={copyPhone}>
                {copyText}
              </button>
            </div>
          )}

          {card.tags.length > 0 && (
            <div className="minimal-card-tags">
              {card.tags.map((tag) => (
                <span key={tag} className="minimal-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="minimal-card-actions">
            <button className="minimal-card-btn minimal-card-btn-primary" onClick={downloadVCard}>
              <i className="fas fa-download" /> Save Contact
            </button>
            {card.webhookUrl && (
              <button
                className="minimal-card-btn"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-share-alt" /> Share Your Data
              </button>
            )}
            <button className="minimal-card-btn" onClick={shareProfile}>
              <i className="fas fa-paper-plane" /> Send This Profile
            </button>
          </div>

          {socials.length > 0 && (
            <div className="minimal-card-socials">
              {socials.map((s) => (
                <a
                  key={s.icon}
                  href={getSocialUrl(s)}
                  className="minimal-card-social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          )}

          {card.email && (
            <a href={`mailto:${card.email}`} className="minimal-card-email-link">
              <i className="fas fa-envelope" />
              {card.email}
            </a>
          )}
        </div>

        {showModal && (
          <div
            className="minimal-card-modal"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="minimal-card-modal-content">
              <h2 className="minimal-card-modal-title">Share Your Data</h2>
              <p className="minimal-card-modal-desc">Enter your contact information to connect.</p>
              <form onSubmit={handleLeadSubmit}>
                <input name="name" placeholder="Full Name" className="minimal-card-input" />
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  className="minimal-card-input"
                  required
                />
                <input name="email" placeholder="Email" type="email" className="minimal-card-input" />
                <input name="telegram" placeholder="Telegram" className="minimal-card-input" />
                <input name="whatsapp" placeholder="WhatsApp" className="minimal-card-input" />
                <input name="linkedin" placeholder="LinkedIn" className="minimal-card-input" />
                <input name="instagram" placeholder="Instagram" className="minimal-card-input" />
                <input name="facebook" placeholder="Facebook" className="minimal-card-input" />
                <button
                  type="submit"
                  className="minimal-card-btn minimal-card-btn-primary"
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
                  className="minimal-card-btn"
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
