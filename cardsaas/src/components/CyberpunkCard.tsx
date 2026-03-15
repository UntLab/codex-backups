"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function CyberpunkCard({ card }: { card: CardData }) {
  const [copyText, setCopyText] = useState("[COPY]");
  const [showModal, setShowModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const accent = card.accentColor || "#00ffcc";
  const bg = card.bgColor || "#030305";

  const roles = [
    card.jobTitle && card.company
      ? `> ${card.jobTitle} @ ${card.company}`
      : card.jobTitle
        ? `> ${card.jobTitle}`
        : card.company
          ? `> ${card.company}`
          : null,
  ].filter(Boolean) as string[];

  const TypewriterText = () => {
    const [text, setText] = useState("");
    const [roleIdx, setRoleIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
      if (roles.length === 0) return;
      const current = roles[roleIdx % roles.length];
      const timeout = setTimeout(
        () => {
          if (!deleting) {
            setText(current.substring(0, charIdx + 1));
            if (charIdx + 1 === current.length) {
              setTimeout(() => setDeleting(true), 2000);
            } else {
              setCharIdx(charIdx + 1);
            }
          } else {
            setText(current.substring(0, charIdx));
            if (charIdx === 0) {
              setDeleting(false);
              setRoleIdx((roleIdx + 1) % roles.length);
            } else {
              setCharIdx(charIdx - 1);
            }
          }
        },
        deleting ? 30 : 60 + Math.random() * 50
      );
      return () => clearTimeout(timeout);
    }, [charIdx, deleting, roleIdx]);

    return (
      <span>
        {text}
        <span className="animate-[blink_1s_infinite]">_</span>
      </span>
    );
  };

  const copyPhone = useCallback(() => {
    if (!card.phone) return;
    navigator.clipboard.writeText(card.phone.replace(/\s/g, "")).then(() => {
      setCopyText("[COPIED]");
      setTimeout(() => setCopyText("[COPY]"), 2000);
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
        // fallthrough
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
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Ссылка скопирована!");
    }
  }, [card.fullName]);

  const handleWebhookSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((v, k) => { data[k] = v as string; });

    if (!data.phone) {
      alert("Телефон обязателен");
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
      setTimeout(() => { setShowModal(false); setSubmitStatus("idle"); }, 2000);
    } catch {
      setSubmitStatus("error");
    }
  }, [card.id]);

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        .card-page * { margin: 0; padding: 0; box-sizing: border-box; }
        .card-page body { overflow: auto; }

        .card-page {
          background-color: ${bg};
          background-image:
            radial-gradient(circle at 15% 50%, ${accent}14, transparent 40%),
            radial-gradient(circle at 85% 30%, #ff003c0d, transparent 40%);
          color: #fff;
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .card-scanlines {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px; z-index: 9999; pointer-events: none;
        }

        .card-glass {
          background: rgba(10, 15, 20, 0.7);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid ${accent}1a;
          border-radius: 16px;
          padding: 40px 30px;
          width: 100%; max-width: 380px;
          text-align: center;
          box-shadow: 0 0 40px ${accent}0d, inset 0 0 20px rgba(0,0,0,0.8);
          position: relative; z-index: 10;
        }

        .card-avatar-container { position: relative; width: 110px; height: 110px; margin: 0 auto 25px auto; }
        .card-avatar {
          width: 100%; height: 100%; border-radius: 12px; object-fit: cover;
          border: 1px solid ${accent}; position: relative; z-index: 2;
          filter: grayscale(20%) contrast(120%);
        }
        .card-avatar-glow {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          border-radius: 12px; box-shadow: 0 0 25px ${accent};
          opacity: 0.4; z-index: 1; animation: card-pulse 3s infinite alternate;
        }
        @keyframes card-pulse { 0% { opacity: 0.2; } 100% { opacity: 0.6; } }

        .card-glitch {
          font-size: 26px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 2px; position: relative; display: inline-block;
          margin-bottom: 5px; animation: card-flicker 5s infinite;
        }
        @keyframes card-flicker {
          0%, 95%, 98%, 100% { opacity: 1; }
          96%, 99% { opacity: 0.1; }
        }

        .card-role {
          font-family: 'JetBrains Mono', monospace; color: ${accent};
          font-size: 13px; margin-bottom: 20px; min-height: 40px; display: block;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .card-phone-wrapper {
          background: ${accent}0d; border: 1px solid ${accent}33;
          border-radius: 8px; display: flex; justify-content: space-between;
          align-items: stretch; margin-bottom: 25px; overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .card-phone-link {
          padding: 12px 15px; display: flex; flex-direction: column; text-align: left;
          text-decoration: none; flex-grow: 1; transition: 0.3s;
        }
        .card-phone-link:hover { background: ${accent}1a; }
        .card-phone-label { color: #5a6b7c; font-size: 10px; text-transform: uppercase; margin-bottom: 2px; font-family: 'JetBrains Mono', monospace; }
        .card-phone-number { color: #fff; letter-spacing: 1px; font-family: 'JetBrains Mono', monospace; font-size: 14px; }

        .card-copy-btn {
          background: ${accent}0d; border: none; border-left: 1px solid ${accent}33;
          color: ${accent}; font-family: 'JetBrains Mono', monospace; font-size: 12px;
          padding: 0 15px; cursor: pointer; transition: 0.3s; font-weight: bold;
          display: flex; align-items: center; justify-content: center; min-width: 80px;
        }
        .card-copy-btn:hover { background: ${accent}; color: #000; }

        .card-tags { display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; flex-wrap: wrap; }
        .card-tag {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          background: rgba(255,255,255,0.03); padding: 4px 8px; color: #5a6b7c;
          border: 1px solid rgba(255,255,255,0.05); text-transform: uppercase;
        }

        .card-actions { display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px; }
        .card-btn {
          width: 100%; padding: 14px; border-radius: 8px; border: 1px solid transparent;
          font-family: 'JetBrains Mono', monospace; font-size: 13px; text-transform: uppercase;
          letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;
          display: flex; justify-content: center; align-items: center; gap: 10px;
          background: none; color: #5a6b7c;
        }
        .card-btn-primary {
          background: ${accent}1a; color: ${accent}; border-color: ${accent};
        }
        .card-btn-primary:hover { background: ${accent}; color: #000; box-shadow: 0 0 20px ${accent}66; }
        .card-btn-secondary { border-color: rgba(255,255,255,0.2); }
        .card-btn-secondary:hover { color: #fff; border-color: ${accent}; background: ${accent}0d; box-shadow: 0 0 15px ${accent}4d; transform: translateY(-2px); }
        .card-btn:active { transform: scale(0.96); box-shadow: none; }

        .card-socials { display: flex; justify-content: center; gap: 12px; margin-top: 25px; flex-wrap: wrap; }
        .card-social-btn { color: #5a6b7c; font-size: 18px; text-decoration: none; transition: 0.3s; }
        .card-social-btn:hover { color: #ff003c; text-shadow: 0 0 10px #ff003c; transform: scale(1.2); }

        .card-email-wrapper { margin-top: 20px; display: flex; justify-content: center; }
        .card-email-link {
          background: ${accent}0d; border: 1px solid ${accent}33; padding: 10px 20px;
          border-radius: 8px; color: ${accent}; text-decoration: none;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          display: flex; align-items: center; gap: 10px; transition: 0.3s;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        .card-email-link:hover { background: ${accent}; color: #000; box-shadow: 0 0 15px ${accent}66; transform: translateY(-2px); }

        .card-modal {
          display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.9); backdrop-filter: blur(5px); z-index: 9999;
          justify-content: center; align-items: center; padding: 15px;
        }
        .card-modal-content {
          background: rgba(10,15,20,0.95); border: 1px solid ${accent};
          border-radius: 8px; padding: 30px 20px; width: 100%; max-width: 400px;
          text-align: center; box-shadow: 0 0 30px ${accent}33;
          max-height: 85vh; overflow-y: auto;
        }
        .card-input {
          width: 100%; padding: 12px 15px; margin-bottom: 12px; border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.6);
          color: ${accent}; outline: none; font-family: 'JetBrains Mono', monospace;
          font-size: 12px; transition: 0.3s;
        }
        .card-input:focus { border-color: ${accent}; box-shadow: 0 0 10px ${accent}33; }
        .card-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div className="card-page">
        <div className="card-scanlines" />

        <div className="card-glass">
          {card.avatarUrl && (
            <div className="card-avatar-container">
              <img src={card.avatarUrl} alt={card.fullName} className="card-avatar" />
              <div className="card-avatar-glow" />
            </div>
          )}

          <div className="card-glitch">{card.fullName}</div>

          {roles.length > 0 && (
            <div className="card-role">
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                &gt; SYSTEM.INIT_ <br />
              </span>
              <TypewriterText />
            </div>
          )}

          {card.phone && (
            <div className="card-phone-wrapper">
              <a href={`tel:${card.phone.replace(/\s/g, "")}`} className="card-phone-link">
                <span className="card-phone-label">[SYS.TEL] / CALL</span>
                <span className="card-phone-number">{card.phone}</span>
              </a>
              <button className="card-copy-btn" onClick={copyPhone}>
                {copyText}
              </button>
            </div>
          )}

          {card.tags.length > 0 && (
            <div className="card-tags">
              {card.tags.map((tag) => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="card-actions">
            <button className="card-btn card-btn-primary" onClick={downloadVCard}>
              <i className="fas fa-download" /> Save Contact
            </button>
            <button className="card-btn card-btn-secondary" onClick={() => setShowModal(true)}>
              <i className="fas fa-terminal" /> Share Your Data
            </button>
            <button className="card-btn card-btn-secondary" onClick={shareProfile}>
              <i className="fas fa-share-nodes" /> Send This Profile
            </button>
          </div>

          {socials.length > 0 && (
            <div className="card-socials">
              {socials.map((s) => (
                <a key={s.icon} href={getSocialUrl(s)} className="card-social-btn" target="_blank" rel="noopener noreferrer">
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          )}

          {card.email && (
            <div className="card-email-wrapper">
              <a href={`mailto:${card.email}`} className="card-email-link">
                <i className="fas fa-envelope" />
                <span>{card.email}</span>
              </a>
            </div>
          )}
        </div>

        {showModal && (
          <div className="card-modal" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="card-modal-content">
              <h2 style={{ marginBottom: 5, fontSize: 20, color: "#fff", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" as const }}>
                &gt; Share_Data
              </h2>
              <p style={{ color: "#5a6b7c", fontSize: 11, marginBottom: 20, fontFamily: "'JetBrains Mono', monospace" }}>
                [SYS.MSG] Enter your contact info
              </p>
              <form onSubmit={handleWebhookSubmit}>
                <input name="name" placeholder="[STR] Full Name" className="card-input" />
                <input name="phone" placeholder="[INT] Phone Number (Req) *" className="card-input" style={{ borderLeft: "3px solid #ff003c" }} />
                <input name="email" placeholder="[STR] Email Address" className="card-input" />
                <input name="telegram" placeholder="[STR] Telegram (@user)" className="card-input" />
                <input name="whatsapp" placeholder="[INT] WhatsApp" className="card-input" />
                <input name="linkedin" placeholder="[URL] LinkedIn" className="card-input" />
                <input name="instagram" placeholder="[STR] Instagram (@user)" className="card-input" />
                <input name="facebook" placeholder="[URL] Facebook" className="card-input" />
                <button
                  type="submit"
                  className="card-btn card-btn-primary"
                  style={{ marginTop: 10 }}
                >
                  {submitStatus === "loading" ? "[ SYNCING... ]" : submitStatus === "done" ? "[ SYNC COMPLETE ]" : submitStatus === "error" ? "[ ERROR ]" : "[ EXECUTE_SYNC ]"}
                </button>
                <button
                  type="button"
                  className="card-btn card-btn-secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => setShowModal(false)}
                >
                  [ ABORT ]
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
