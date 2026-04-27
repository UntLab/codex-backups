import {
  FORMAG_COMPANY,
  FORMAG_SITE_URL,
  isFormagCorporateTheme,
} from "@/lib/formag";
import { PRG_COMPANY, PRG_SITE_URL, isPrgTechTheme } from "@/lib/prg";

export interface CardContactData {
  slug: string;
  fullName: string;
  jobTitle?: string | null;
  company?: string | null;
  phone?: string | null;
  secondaryPhone?: string | null;
  email?: string | null;
  website?: string | null;
  officeAddress?: string | null;
  theme?: string | null;
}

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function expandPhoneNumbers(phone?: string | null): string[] {
  if (!phone?.trim()) {
    return [];
  }

  const trimmed = phone.trim();
  const slashMatch = trimmed.match(/^(.*?)(\d+)\s*\/\s*(\d+)$/);

  if (!slashMatch) {
    return [trimmed];
  }

  const [, prefix, firstNumber, secondSuffix] = slashMatch;
  const secondNumber =
    firstNumber.slice(0, Math.max(0, firstNumber.length - secondSuffix.length)) +
    secondSuffix;

  return [`${prefix}${firstNumber}`, `${prefix}${secondNumber}`];
}

function getNameParts(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return { firstName: parts[0] || fullName, lastName: "" };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) || "",
  };
}

export function getCardContactPath(slug: string): string {
  return `/card/${slug}/contact.vcf`;
}

export function getCardContactUrl(slug: string, origin: string): string {
  return new URL(getCardContactPath(slug), origin).toString();
}

export function buildCardVCard(card: CardContactData): string {
  const { firstName, lastName } = getNameParts(card.fullName);
  const company = isFormagCorporateTheme(card.theme)
    ? FORMAG_COMPANY
    : isPrgTechTheme(card.theme)
      ? PRG_COMPANY
      : card.company?.trim();
  const website = isFormagCorporateTheme(card.theme)
    ? FORMAG_SITE_URL
    : isPrgTechTheme(card.theme)
      ? PRG_SITE_URL
      : card.website?.trim();
  const address = card.officeAddress?.trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(card.fullName)}`,
  ];

  if (company) {
    lines.push(`ORG:${escapeVCardValue(company)}`);
  }

  if (card.jobTitle?.trim()) {
    lines.push(`TITLE:${escapeVCardValue(card.jobTitle.trim())}`);
  }

  expandPhoneNumbers(card.phone).forEach((phone) => {
    lines.push(`TEL;TYPE=WORK,VOICE:${normalizePhone(phone)}`);
  });

  expandPhoneNumbers(card.secondaryPhone).forEach((phone) => {
    lines.push(`TEL;TYPE=WORK,CELL:${normalizePhone(phone)}`);
  });

  if (card.email?.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${escapeVCardValue(card.email.trim())}`);
  }

  if (website) {
    lines.push(`URL:${escapeVCardValue(website)}`);
  }

  if (address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(address)};;;;`);
    lines.push(`LABEL;TYPE=WORK:${escapeVCardValue(address)}`);
  }

  lines.push("END:VCARD");

  return lines.join("\n");
}

export async function downloadCardContact(card: CardContactData) {
  const response = await fetch(getCardContactPath(card.slug));

  if (!response.ok) {
    throw new Error("Failed to download contact");
  }

  const blob = await response.blob();
  const file = new File([blob], `${card.slug}.vcf`, { type: "text/vcard" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: card.fullName });
      return;
    } catch {
      // fall through to direct download
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${card.slug}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
