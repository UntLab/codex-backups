export const PRG_THEME = "prg_tech";
export const PRG_ORANGE_THEME = "prg_tech_orange";
export const PRG_COMPANY = "Progress PRG";
export const PRG_SITE_LABEL = "www.prg.az";
export const PRG_SITE_URL = "https://www.prg.az";
export const PRG_ACCENT = "#58d5ff";
export const PRG_BG = "#07131d";
export const PRG_ORANGE_ACCENT = "#f27a1a";
export const PRG_ORANGE_BG = "#2f3438";
export const PRG_DEFAULT_OFFICE_ADDRESS =
  "Islam Safarli 20/5b\nBaku, Azerbaijan";

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

export const PRG_SYSTEM_TEMPLATE: TemplateLike = {
  id: "system-prg-tech",
  name: "PRG Tech",
  userId: null,
  isPublic: false,
  isSystem: true,
  theme: PRG_THEME,
  accentColor: PRG_ACCENT,
  bgColor: PRG_BG,
  fontFamily: "Space Grotesk",
  borderRadius: "20",
  cardStyle: "precision-tech",
  preview: null,
  createdAt: new Date(0),
};

export const PRG_ORANGE_SYSTEM_TEMPLATE: TemplateLike = {
  id: "system-prg-tech-orange",
  name: "PRG Tech Orange",
  userId: null,
  isPublic: false,
  isSystem: true,
  theme: PRG_ORANGE_THEME,
  accentColor: PRG_ORANGE_ACCENT,
  bgColor: PRG_ORANGE_BG,
  fontFamily: "Space Grotesk",
  borderRadius: "20",
  cardStyle: "precision-tech-orange",
  preview: null,
  createdAt: new Date(0),
};

export function isPrgTechTheme(theme?: string | null): boolean {
  return theme === PRG_THEME || theme === PRG_ORANGE_THEME;
}

export function isPrgOrangeTheme(theme?: string | null): boolean {
  return theme === PRG_ORANGE_THEME;
}

export interface PrgThemeInput {
  theme?: string | null;
  company?: string | null;
  website?: string | null;
  accentColor?: string | null;
  bgColor?: string | null;
  officeAddress?: string | null;
}

export function applyPrgThemeDefaults<T extends PrgThemeInput>(data: T): T {
  if (!isPrgTechTheme(data.theme)) {
    return data;
  }

  return {
    ...data,
    company: PRG_COMPANY,
    website: PRG_SITE_URL,
    accentColor: isPrgOrangeTheme(data.theme) ? PRG_ORANGE_ACCENT : PRG_ACCENT,
    bgColor: isPrgOrangeTheme(data.theme) ? PRG_ORANGE_BG : PRG_BG,
    officeAddress:
      data.officeAddress && data.officeAddress.trim()
        ? data.officeAddress
        : PRG_DEFAULT_OFFICE_ADDRESS,
  };
}
