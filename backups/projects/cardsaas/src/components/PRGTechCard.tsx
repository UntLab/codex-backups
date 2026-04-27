"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import QRCode from "qrcode";
import {
  getCardContactPath,
  getCardContactUrl,
  type CardContactData,
} from "@/lib/card-contact";
import {
  PRG_COMPANY,
  PRG_DEFAULT_OFFICE_ADDRESS,
  isPrgOrangeTheme,
  PRG_SITE_LABEL,
  PRG_SITE_URL,
} from "@/lib/prg";
import styles from "./PRGTechCard.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
});

interface CardData extends CardContactData {
  id: string;
  avatarUrl?: string | null;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.58 10.49" />
    </svg>
  );
}

function ArrowGridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
      <path d="M4 4h4" />
      <path d="M4 8h4" />
      <path d="M4 12h2" />
    </svg>
  );
}

function getDialTarget(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function getOfficeMapUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function getOfficeLines(address?: string | null) {
  const source = address?.trim() || PRG_DEFAULT_OFFICE_ADDRESS;
  const parts = source
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    primary: parts[0] || "Islam Safarli 20/5b",
    secondary: parts.slice(1).join(", ") || "Baku, Azerbaijan",
  };
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function CompactAction({
  label,
  value,
  onClick,
  icon,
}: {
  label: string;
  value: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button type="button" className={styles.compactAction} onClick={onClick}>
      <span className={styles.compactActionIcon}>{icon}</span>
      <span className={styles.compactActionText}>
        <span className={styles.compactActionLabel}>{label}</span>
        <span className={styles.compactActionValue}>{value}</span>
      </span>
    </button>
  );
}

function DetailRow({
  label,
  value,
  onClick,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button type="button" className={styles.detailRow} onClick={onClick}>
      <span className={styles.detailIcon}>{icon}</span>
      <span className={styles.detailBody}>
        <span className={styles.detailLabel}>{label}</span>
        <span className={styles.detailValue}>{value}</span>
      </span>
      <span className={styles.detailArrow}>
        <ArrowGridIcon />
      </span>
    </button>
  );
}

export default function PRGTechCard({ card }: { card: CardData }) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [qrSrc, setQrSrc] = useState("");
  const callPhone = card.phone?.trim() || "";
  const secondaryPhone = card.secondaryPhone?.trim() || "";
  const email = card.email?.trim() || "";
  const avatarUrl = card.avatarUrl?.trim() || "";
  const office = useMemo(() => getOfficeLines(card.officeAddress), [card.officeAddress]);
  const statLabel = card.jobTitle?.trim() || "Technology Lead";

  const handleCall = useCallback(() => {
    if (!callPhone) return;
    window.location.href = `tel:${getDialTarget(callPhone)}`;
  }, [callPhone]);

  const handleEmail = useCallback(() => {
    if (!email) return;
    window.location.href = `mailto:${email}`;
  }, [email]);

  const handleOffice = useCallback(() => {
    const address = card.officeAddress?.trim() || PRG_DEFAULT_OFFICE_ADDRESS;
    window.open(getOfficeMapUrl(address), "_blank");
  }, [card.officeAddress]);

  const handleWebsite = useCallback(() => {
    window.open(PRG_SITE_URL, "_blank");
  }, []);

  const handleSaveContact = useCallback(() => {
    window.location.href = getCardContactPath(card.slug);
  }, [card.slug]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${card.fullName} | ${statLabel} | ${PRG_COMPANY}`,
      text: `Connect with ${card.fullName} from ${PRG_COMPANY}.`,
      url: window.location.href,
    };

    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled
      }
    }

    await navigator.clipboard.writeText(window.location.href);
    window.alert("Card link copied to clipboard.");
  }, [card.fullName, statLabel]);

  useEffect(() => {
    let cancelled = false;
    const isOrange = isPrgOrangeTheme(card.theme);

    async function generateQr() {
      const contactUrl = getCardContactUrl(card.slug, window.location.origin);
      const nextQrSrc = await QRCode.toDataURL(contactUrl, {
        width: 420,
        margin: 1,
        color: {
          dark: isOrange ? "#ffb56f" : "#b9f3ff",
          light: isOrange ? "#2b3034" : "#07131d",
        },
      });

      if (!cancelled) {
        setQrSrc(nextQrSrc);
      }
    }

    void generateQr();

    return () => {
      cancelled = true;
    };
  }, [card.slug, card.theme]);

  return (
    <main
      className={`${styles.prgScreen} ${
        isPrgOrangeTheme(card.theme) ? styles.orangeTheme : ""
      } ${inter.className}`}
    >
      <div className={styles.gridGlow} />
      <section className={styles.cardShell}>
        <header className={styles.header}>
          <div className={styles.brandBlock}>
            <span className={`${styles.brandMono} ${spaceGrotesk.className}`}>
              PRG
            </span>
            <div>
              <p className={styles.brandLabel}>Progress PRG</p>
              <p className={styles.brandSubtle}>Precision Build Systems</p>
            </div>
          </div>

          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${
                activeSide === "front" ? styles.toggleButtonActive : ""
              }`}
              onClick={() => setActiveSide("front")}
            >
              Front
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${
                activeSide === "back" ? styles.toggleButtonActive : ""
              }`}
              onClick={() => setActiveSide("back")}
            >
              Back
            </button>
          </div>
        </header>

        {activeSide === "front" ? (
          <div className={styles.frontSide}>
            <section className={styles.heroPanel}>
              <div className={styles.heroMeta}>
                <span className={styles.heroEyebrow}>Technology identity card</span>
                <span className={styles.heroCode}>SITE // {PRG_SITE_LABEL}</span>
              </div>

              <div className={styles.heroContent}>
                <div className={styles.portraitWrap}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${card.fullName} portrait`}
                      className={styles.portrait}
                    />
                  ) : (
                    <div className={styles.portraitFallback}>{getInitials(card.fullName)}</div>
                  )}
                </div>

                <div className={styles.identityBlock}>
                  <p className={styles.companyTag}>{PRG_COMPANY}</p>
                  <h1 className={`${styles.name} ${spaceGrotesk.className}`}>
                    {card.fullName}
                  </h1>
                  <p className={styles.role}>{statLabel}</p>
                  <p className={styles.leadCopy}>
                    Digital contact card for a high-tech construction environment.
                    Built to share, save, and route verified contact data quickly.
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.compactActions}>
              <CompactAction
                label="Call"
                value={callPhone || "Add phone"}
                onClick={handleCall}
                icon={<PhoneIcon />}
              />
              <CompactAction
                label="Email"
                value={email || "Add email"}
                onClick={handleEmail}
                icon={<MailIcon />}
              />
            </section>

            <section className={styles.infoPanel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelEyebrow}>Live contact surface</p>
                <p className={styles.panelHint}>Tap any row to jump into the next action.</p>
              </div>

              <div className={styles.detailsStack}>
                <DetailRow label="Direct line" value={callPhone || "Add phone"} onClick={handleCall} icon={<PhoneIcon />} />
                {secondaryPhone ? (
                  <DetailRow
                    label="Office line"
                    value={secondaryPhone}
                    onClick={handleCall}
                    icon={<PhoneIcon />}
                  />
                ) : null}
                <DetailRow label="Email" value={email || "Add email"} onClick={handleEmail} icon={<MailIcon />} />
                <DetailRow
                  label="Office"
                  value={
                    <>
                      {office.primary}
                      <span className={styles.detailSubValue}>{office.secondary}</span>
                    </>
                  }
                  onClick={handleOffice}
                  icon={<MapIcon />}
                />
                <DetailRow label="Website" value={PRG_SITE_LABEL} onClick={handleWebsite} icon={<GlobeIcon />} />
              </div>
            </section>

            <footer className={styles.footer}>
              <button type="button" className={styles.primaryAction} onClick={handleSaveContact}>
                <SaveIcon />
                Save contact
              </button>
              <button type="button" className={styles.secondaryAction} onClick={handleShare}>
                <ShareIcon />
                Share card
              </button>
            </footer>
          </div>
        ) : (
          <section className={styles.backSide}>
            <div className={styles.backHero}>
              <span className={`${styles.backMono} ${spaceGrotesk.className}`}>PRG</span>
              <p className={styles.backTag}>Verified digital contact route</p>
            </div>

            <div className={styles.qrModule}>
              <div className={styles.qrFrame}>
                {qrSrc ? (
                  <img src={qrSrc} alt="QR code" className={styles.qrImage} />
                ) : (
                  <div className={styles.qrFallback}>QR loading…</div>
                )}
              </div>
              <div className={styles.qrText}>
                <p className={styles.qrEyebrow}>Scan + save</p>
                <h2 className={`${styles.qrName} ${spaceGrotesk.className}`}>
                  {card.fullName}
                </h2>
                <p className={styles.qrRole}>{statLabel}</p>
                <p className={styles.qrHint}>
                  Point the camera at the code and save the pre-filled PRG contact
                  card directly to your phone.
                </p>
              </div>
            </div>

            <div className={styles.backInfoRail}>
              <div className={styles.backInfoItem}>
                <span className={styles.backInfoLabel}>Company</span>
                <span className={styles.backInfoValue}>{PRG_COMPANY}</span>
              </div>
              <div className={styles.backInfoItem}>
                <span className={styles.backInfoLabel}>Web</span>
                <span className={styles.backInfoValue}>{PRG_SITE_LABEL}</span>
              </div>
              <div className={styles.backInfoItem}>
                <span className={styles.backInfoLabel}>Route</span>
                <span className={styles.backInfoValue}>Secure contact file</span>
              </div>
            </div>

            <button type="button" className={styles.primaryAction} onClick={handleSaveContact}>
              <SaveIcon />
              Save contact
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
