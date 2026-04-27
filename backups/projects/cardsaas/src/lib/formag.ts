export const FORMAG_THEME = "formag_corporate";
export const FORMAG_COMPANY = "Formag Forwarding";
export const FORMAG_SITE_LABEL = "www.formag.com";
export const FORMAG_SITE_URL = "https://www.formag.com";
export const FORMAG_LOGO_PATH = "/brand/formag/logo2-trim.png";
export const FORMAG_ACCENT = "#ea6b1d";
export const FORMAG_BG = "#ececec";
export const FORMAG_DEFAULT_OFFICE_ADDRESS =
  "Gurban Khalilov 3, AZ1006\nBaku, Azerbaijan";

export interface TemplateLike {
  id: string;
  name: string;
  userId: string | null;
  isPublic: boolean;
  isSystem: boolean;
  theme: string;
  accentColor: string;
  bgColor: string;
  fontFamily: string;
  borderRadius: string;
  cardStyle: string | null;
  preview: string | null;
  createdAt: Date;
}

export const FORMAG_SYSTEM_TEMPLATE: TemplateLike = {
  id: "system-formag-corporate",
  name: "Formag Corporate",
  userId: null,
  isPublic: false,
  isSystem: true,
  theme: FORMAG_THEME,
  accentColor: FORMAG_ACCENT,
  bgColor: FORMAG_BG,
  fontFamily: "Inter",
  borderRadius: "12",
  cardStyle: "fixed-corporate",
  preview: null,
  createdAt: new Date(0),
};

export function isFormagCorporateTheme(theme?: string | null): boolean {
  return theme === FORMAG_THEME;
}

export interface FormagThemeInput {
  theme?: string | null;
  company?: string | null;
  website?: string | null;
  accentColor?: string | null;
  bgColor?: string | null;
  officeAddress?: string | null;
}

export function applyFormagThemeDefaults<T extends FormagThemeInput>(data: T): T {
  if (!isFormagCorporateTheme(data.theme)) {
    return data;
  }

  return {
    ...data,
    company: FORMAG_COMPANY,
    website: FORMAG_SITE_URL,
    accentColor: FORMAG_ACCENT,
    bgColor: FORMAG_BG,
    officeAddress:
      data.officeAddress && data.officeAddress.trim()
        ? data.officeAddress
        : FORMAG_DEFAULT_OFFICE_ADDRESS,
  };
}
