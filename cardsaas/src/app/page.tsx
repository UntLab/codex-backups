import Link from "next/link";

const features = [
  {
    icon: "fas fa-wand-magic-sparkles",
    title: "AI-Powered Themes",
    desc: "Instantly switch between sleek, minimalist AI identity and raw, glitch-cyber terminal designs. One click, infinite styles.",
    color: "#a855f7",
  },
  {
    icon: "fas fa-bolt",
    title: "Instant PWA Sharing",
    desc: "Your contacts install your vCard like a native app on their phone. Opens in milliseconds with no address bar — pure native feel.",
    color: "#f59e0b",
  },
  {
    icon: "fas fa-signal",
    title: "NFC-Ready Data",
    desc: "Your vCard generates standard NDEF data, ready to be written to any blank NFC card. Share contacts with a physical tap.",
    color: "#34d399",
  },
  {
    icon: "fas fa-server",
    title: "CRM Integration",
    desc: "Capture extensive lead data — Email, Telegram, WhatsApp — and automatically sync it to your CRM pipeline via n8n webhooks.",
    color: "#0ea5e9",
  },
];

const proFeatures = [
  "1 Digital Identity Card",
  "3 Premium Cyber Themes",
  "QR Code Auto-Generation",
  "Real-Time View Analytics",
  "vCard One-Tap Save",
  "Webhook Integration",
  "Mobile PWA Support",
];

const enterpriseFeatures = [
  "Everything in Starter",
  "Unlimited Identity Cards",
  "15+ Premium Themes",
  "Team & Multi-User Access",
  "CRM Lead Management",
  "Custom Domain Binding",
  "AI Contact Assistant",
  "Priority API Access",
  "Dedicated Support",
];

export default function LandingPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
        <div className="scanlines" />

        {/* Nebula glow blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: -1 }} aria-hidden="true">
          <div style={{ position: "absolute", top: "-15%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: "#6366f1", opacity: 0.04, filter: "blur(150px)" }} />
          <div style={{ position: "absolute", top: "20%", right: "-8%", width: 500, height: 500, borderRadius: "50%", background: "#a855f7", opacity: 0.04, filter: "blur(140px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "25%", width: 550, height: 550, borderRadius: "50%", background: "#0ea5e9", opacity: 0.03, filter: "blur(160px)" }} />
        </div>

        {/* ─── HEADER ─── */}
        <header style={{ width: "100%", padding: "24px 0", position: "relative", zIndex: 10 }}>
          <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: "#fff", textDecoration: "none" }}>
              UNT<span className="gradient-text">LAB</span>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link
                href="/login"
                style={{ fontSize: 14, color: "var(--color-text-muted)", textDecoration: "none", letterSpacing: "0.5px", transition: "color 0.2s" }}
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-primary" style={{ padding: "10px 20px", fontSize: 12, borderRadius: 10, letterSpacing: 1.5 }}>
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ─── HERO ─── */}
        <section style={{ width: "100%", paddingTop: 56, paddingBottom: 64, position: "relative", zIndex: 10 }}>
          <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
            <div className="mono" style={{ marginBottom: 24, letterSpacing: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--color-emerald)", marginRight: 8, boxShadow: "0 0 8px rgba(52,211,153,0.6)" }} />
              NEXT-GEN IDENTITY PLATFORM
            </div>

            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: -0.5, textAlign: "center" }}>
              Digital Identity,
              <br />
              <span className="gradient-text">Redefined</span>.
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--color-text-muted)", maxWidth: 620, margin: "0 auto 32px auto", lineHeight: 1.7, fontWeight: 300, textAlign: "center" }}>
              Generate{" "}
              <span style={{ color: "var(--color-secondary)", fontWeight: 500 }}>
                premium, interactive identity
              </span>{" "}
              cards that look insanely expensive. The ultimate blend of sleek{" "}
              <span style={{ color: "var(--color-cyan)", fontWeight: 500 }}>glassmorphism</span>,
              tech vibes, and seamless connectivity.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              <Link href="/register" className="btn-primary">
                <i className="fas fa-rocket" style={{ fontSize: 12 }} />
                Start Generation
              </Link>
              <Link href="#features" className="btn-outline">
                <i className="fas fa-grid-2" style={{ fontSize: 12 }} />
                Explore Features
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" style={{ width: "100%", padding: "48px 0", position: "relative", zIndex: 10 }}>
          <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="mono" style={{ marginBottom: 16, letterSpacing: 3 }}>SYSTEM_FEATURES_</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
                Built for the{" "}
                <span className="gradient-text">future</span>
              </h2>
            </div>

            <div data-grid-features="" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }}>
              {features.map((f) => (
                <div key={f.title} className="glass-panel" style={{ padding: 40, textAlign: "center" }}>
                  <div
                    style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, marginLeft: "auto", marginRight: "auto", background: `${f.color}15` }}
                  >
                    <i
                      className={f.icon}
                      style={{ fontSize: 20, color: f.color, filter: `drop-shadow(0 0 8px ${f.color}50)` }}
                    />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, color: "#fff", letterSpacing: "0.5px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: 300, margin: "0 auto" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section style={{ width: "100%", padding: "48px 0", position: "relative", zIndex: 10 }}>
          <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="mono" style={{ marginBottom: 16, letterSpacing: 3 }}>PRICING_MODEL_</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
                Choose your{" "}
                <span className="gradient-text">tier</span>
              </h2>
              <p style={{ color: "var(--color-text-muted)", marginTop: 12, fontSize: 16, fontWeight: 300, maxWidth: 450, marginLeft: "auto", marginRight: "auto" }}>
                Start with a single card, or go unlimited for your entire team.
              </p>
            </div>

            <div data-grid-pricing="" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, maxWidth: 780, margin: "0 auto" }}>
              {/* STARTER PLAN */}
              <div className="glass-panel" style={{ padding: 40, display: "flex", flexDirection: "column", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>$10</span>
                  <span style={{ fontSize: 16, fontWeight: 300, color: "var(--color-text-dim)" }}>/mo</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-text-dim)", marginBottom: 28, fontFamily: "var(--font-mono), monospace", letterSpacing: 2 }}>
                  PER DIGITAL CARD
                </p>

                <div style={{ width: "70%", height: 1, margin: "0 auto 28px auto", background: "linear-gradient(to right, transparent, rgba(14,165,233,0.2), transparent)" }} />

                <ul style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, flexGrow: 1, alignItems: "center", listStyle: "none" }}>
                  {proFeatures.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13.5, color: "var(--color-text-main)" }}>
                      <i className="fas fa-check" style={{ fontSize: 11, color: "var(--color-cyan)", filter: "drop-shadow(0 0 4px rgba(14,165,233,0.5))" }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                  Get Started
                </Link>
              </div>

              {/* ENTERPRISE PLAN */}
              <div className="glass-panel" style={{ padding: 40, display: "flex", flexDirection: "column", textAlign: "center", borderColor: "rgba(168,85,247,0.2)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, #6366f1, #a855f7, #6366f1)" }} />

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>Custom</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-text-dim)", marginBottom: 28, fontFamily: "var(--font-mono), monospace", letterSpacing: 2 }}>
                  TAILORED AGREEMENT
                </p>

                <div style={{ width: "70%", height: 1, margin: "0 auto 28px auto", background: "linear-gradient(to right, transparent, rgba(168,85,247,0.2), transparent)" }} />

                <ul style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, flexGrow: 1, alignItems: "center", listStyle: "none" }}>
                  {enterpriseFeatures.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13.5, color: "var(--color-text-main)" }}>
                      <i className="fas fa-check" style={{ fontSize: 11, color: "var(--color-secondary)", filter: "drop-shadow(0 0 4px rgba(168,85,247,0.5))" }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="mailto:id@2ai.az" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ width: "100%", padding: "48px 0", position: "relative", zIndex: 10 }}>
          <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
            <div className="glass-panel" style={{ padding: "40px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent, var(--color-cyan), transparent)" }} />
              <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, marginBottom: 16 }}>
                Ready to go{" "}
                <span className="gradient-text">digital</span>?
              </h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: 15, marginBottom: 32, fontWeight: 300, lineHeight: 1.7, maxWidth: 450, margin: "0 auto 32px auto" }}>
                Join professionals who replaced paper cards with something smarter. Create your first identity card in under 60 seconds.
              </p>
              <Link href="/register" className="btn-primary">
                <i className="fas fa-play" style={{ fontSize: 12 }} />
                Create Your Card
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ width: "100%", padding: "28px 0", position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--color-text-dim)", letterSpacing: 2 }}>
              &copy; 2026 UNTLAB IDENTITY SYSTEMS
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <Link href="#" className="mono" style={{ fontSize: 11, color: "var(--color-text-dim)", letterSpacing: 2, textDecoration: "none" }}>
                Privacy
              </Link>
              <Link href="#" className="mono" style={{ fontSize: 11, color: "var(--color-text-dim)", letterSpacing: 2, textDecoration: "none" }}>
                Terms
              </Link>
              <span className="mono" style={{ fontSize: 11, color: "var(--color-text-dim)", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-emerald)", animation: "pulse 2s infinite" }} />
                All Systems Operational
              </span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-grid-features] { grid-template-columns: 1fr !important; }
          [data-grid-pricing] { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
