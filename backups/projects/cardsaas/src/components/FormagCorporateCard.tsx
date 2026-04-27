"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import QRCode from "qrcode";
import {
  getCardContactPath,
  getCardContactUrl,
  type CardContactData,
} from "@/lib/card-contact";
import {
  FORMAG_COMPANY,
  FORMAG_LOGO_PATH,
  FORMAG_SITE_LABEL,
  FORMAG_SITE_URL,
} from "@/lib/formag";
import styles from "./FormagCorporateCard.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface CardData extends CardContactData {
  id: string;
  company?: string | null;
  avatarUrl?: string | null;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
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
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.83 3.98" />
    </svg>
  );
}

function FlagAz() {
  return (
    <svg className={styles.flagAz} viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#00bfff" />
      <rect y="6.6" width="28" height="6.6" fill="#cd5c5c" />
      <rect y="13.3" width="28" height="6.6" fill="#32cd32" />
      <path
        d="M12.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12.5 8.7a1.2 1.2 0 1 1 0-2.5 1.2 1.2 0 0 1 0 2.5z"
        fill="#fff"
      />
      <path d="M14 10l.7-.7.7.7-.7.7z" fill="#fff" />
    </svg>
  );
}

function truncateEmail(email?: string | null): string {
  if (!email) return "";
  if (email.length <= 18) return email;
  const [name = "", domain = ""] = email.split("@");
  if (!domain) return `${email.slice(0, 15)}...`;
  return `${name.slice(0, 8)}@${domain.slice(0, 6)}...`;
}

function getOfficePreview(address?: string | null): string {
  if (!address?.trim()) return "Baku, Azerbaijan";
  const lines = address
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.at(-1) || "Baku, Azerbaijan";
}

function getOfficeLines(address?: string | null): [string, string] {
  if (!address?.trim()) {
    return ["Gurban Khalilov 3, AZ1006 Baku", "Baku, Azerbaijan"];
  }

  const lines = address
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 1) {
    return [lines[0], "Baku, Azerbaijan"];
  }

  return [lines[0], lines.slice(1).join(" ")];
}

function getDialTarget(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function getOfficeMapUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function FormagCorporateCard({ card }: { card: CardData }) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [qrSrc, setQrSrc] = useState("");

  const [addressLine1, addressLine2] = useMemo(
    () => getOfficeLines(card.officeAddress),
    [card.officeAddress]
  );

  const callPhone = card.phone?.trim() || "";
  const officePhone = card.secondaryPhone?.trim() || "";
  const email = card.email?.trim() || "";
  const avatarUrl = card.avatarUrl?.trim() || "";
  const officePreview = getOfficePreview(card.officeAddress);

  const handleCall = useCallback(() => {
    if (!callPhone) return;
    window.location.href = `tel:${getDialTarget(callPhone)}`;
  }, [callPhone]);

  const handleEmail = useCallback(() => {
    if (!email) return;
    window.location.href = `mailto:${email}`;
  }, [email]);

  const handleOffice = useCallback(() => {
    if (!card.officeAddress) return;
    window.open(getOfficeMapUrl(card.officeAddress), "_blank");
  }, [card.officeAddress]);

  const handleWebsite = useCallback(() => {
    window.open(FORMAG_SITE_URL, "_blank");
  }, []);

  const handleSaveContact = useCallback(() => {
    window.location.href = getCardContactPath(card.slug);
  }, [card.slug]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.fullName} | ${card.jobTitle || "Digital Card"} | ${FORMAG_COMPANY}`,
          text: "Посмотрите мою цифровую визитную карточку!",
          url: window.location.href,
        });
        return;
      } catch {
        // ignore cancelled share
      }
    }

    window.alert(
      "Общий доступ к этой странице не поддерживается этим браузером. Скопируйте ссылку."
    );
  }, [card.fullName, card.jobTitle]);

  useEffect(() => {
    let cancelled = false;

    async function generateQr() {
      const contactUrl = getCardContactUrl(card.slug, window.location.origin);
      const nextQrSrc = await QRCode.toDataURL(contactUrl, {
        width: 420,
        margin: 1,
        color: {
          dark: "#332d2c",
          light: "#ffffff",
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
  }, [card.slug]);

  return (
    <main className={`${styles.formagScreen} ${inter.className}`}>
      <div className={styles.cardContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={FORMAG_LOGO_PATH} alt={`${FORMAG_COMPANY} Logo`} />
          </div>

          <div className={styles.toggleContainer}>
            <button
              type="button"
              className={`${styles.toggleButton} ${activeSide === "front" ? styles.activeToggleButton : ""}`}
              onClick={() => setActiveSide("front")}
            >
              Front
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${activeSide === "back" ? styles.activeToggleButton : ""}`}
              onClick={() => setActiveSide("back")}
            >
              Back
            </button>
          </div>
        </div>

        {activeSide === "front" ? (
          <>
            <div className={styles.hero}>
              <div className={styles.heroPhotoContainer}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${card.fullName} | ${card.jobTitle || "Profile"}`}
                  />
                ) : (
                  <img src={FORMAG_LOGO_PATH} alt={`${FORMAG_COMPANY} Logo`} />
                )}
              </div>

              <div className={styles.heroInfo}>
                <h1 className={styles.name}>{card.fullName}</h1>
                <p className={styles.title}>{card.jobTitle || "Business contact"}</p>
              </div>
            </div>

            <div className={styles.actionsGrid}>
              <button
                className={`${styles.actionButton} ${styles.callActionButton}`}
                type="button"
                onClick={handleCall}
              >
                <div className={styles.iconContainer}>
                  <PhoneIcon />
                </div>
                <div className={styles.textContainer}>
                  <span className={styles.actionButtonTitle}>Call</span>
                  <span className={styles.actionButtonDetail}>{callPhone}</span>
                </div>
              </button>

              <button
                className={styles.actionButton}
                type="button"
                onClick={handleEmail}
              >
                <div className={styles.iconContainer}>
                  <MailIcon />
                </div>
                <div className={styles.textContainer}>
                  <span className={styles.actionButtonTitle}>Email</span>
                  <span className={styles.actionButtonDetail}>
                    {truncateEmail(email)}
                  </span>
                </div>
              </button>

              <button
                className={styles.actionButton}
                type="button"
                onClick={handleOffice}
              >
                <div className={styles.iconContainer}>
                  <MapIcon />
                </div>
                <div className={styles.textContainer}>
                  <span className={styles.actionButtonTitle}>Office</span>
                  <span className={styles.actionButtonDetail}>{officePreview}</span>
                </div>
              </button>

              <button
                className={styles.actionButton}
                type="button"
                onClick={handleWebsite}
              >
                <div className={styles.iconContainer}>
                  <GlobeIcon />
                </div>
                <div className={styles.textContainer}>
                  <span className={styles.actionButtonTitle}>Website</span>
                  <span className={styles.actionButtonDetail}>
                    {FORMAG_SITE_LABEL}
                  </span>
                </div>
              </button>
            </div>

            <div className={styles.details}>
              <p className={styles.detailsHeader}>Contact Details</p>

              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <PhoneIcon />
                </div>
                <div className={styles.detailItemText}>
                  {callPhone ? (
                    <p className={styles.detailItemValue}>{callPhone}</p>
                  ) : null}
                  {officePhone ? (
                    <p className={styles.detailItemValue}>{officePhone}</p>
                  ) : null}
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <MailIcon />
                </div>
                <div className={styles.detailItemText}>
                  <p className={styles.detailItemValue}>{email}</p>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <MapIcon />
                </div>
                <div className={styles.detailItemText}>
                  <p className={styles.detailItemValue}>{addressLine1}</p>
                  <p className={styles.detailItemValue}>
                    {addressLine2} <FlagAz />
                  </p>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <GlobeIcon />
                </div>
                <div className={styles.detailItemText}>
                  <p className={styles.detailItemValue}>{FORMAG_SITE_LABEL}</p>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <p className={styles.saveReadyHeader}>Save-Ready</p>
              <p className={styles.instructionText}>
                One tap opens the contact file with the filled-in details ready
                to save.
              </p>

              <div className={styles.actionButtonsContainer}>
                <button
                  className={`${styles.finalActionButton} ${styles.saveContactButton}`}
                  type="button"
                  onClick={handleSaveContact}
                >
                  <SaveIcon />
                  Save contact
                </button>
                <button
                  className={`${styles.finalActionButton} ${styles.shareCardButton}`}
                  type="button"
                  onClick={handleShare}
                >
                  <ShareIcon />
                  Share card
                </button>
              </div>
            </div>
          </>
        ) : (
          <section className={styles.backSide}>
            <div className={styles.backLogoWrap}>
              <img
                className={styles.backLogo}
                src={FORMAG_LOGO_PATH}
                alt={`${FORMAG_COMPANY} Logo`}
              />
            </div>

            <div className={styles.backQrPanel}>
              {qrSrc ? (
                <img className={styles.backQrImage} src={qrSrc} alt="QR code" />
              ) : (
                <div className={styles.backQrFallback}>QR loading…</div>
              )}
            </div>

            <div className={styles.backTextBlock}>
              <p className={styles.backEyebrow}>Scan to save contact</p>
              <h2 className={styles.backName}>{card.fullName}</h2>
              <p className={styles.backRole}>
                {card.jobTitle || "Business contact"}
              </p>
              <p className={styles.backHint}>
                Open the camera, scan the QR, and save the pre-filled contact
                card directly to your phone.
              </p>
            </div>

            <button
              className={`${styles.finalActionButton} ${styles.saveContactButton}`}
              type="button"
              onClick={handleSaveContact}
            >
              <SaveIcon />
              Save contact
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
