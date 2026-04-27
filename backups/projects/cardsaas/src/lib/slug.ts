const transliterationMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ы: "y",
  э: "e",
  ю: "yu",
  я: "ya",
  ə: "e",
  ğ: "g",
  ı: "i",
  ö: "o",
  ü: "u",
  ş: "s",
  ç: "c",
};

export function slugify(value?: string | null) {
  const transliterated = Array.from(value?.trim() || "")
    .map((character) => {
      const lower = character.toLowerCase();
      return transliterationMap[lower] ?? character;
    })
    .join("");

  return transliterated
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildCardSlugBase({
  slug,
  fullName,
  fallback,
}: {
  slug?: string | null;
  fullName?: string | null;
  fallback: string;
}) {
  return slugify(slug) || slugify(fullName) || slugify(fallback) || "card";
}
