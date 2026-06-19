import type {
  EthbatDisplaySettings,
  EthbatKind,
  EthbatLanguage,
  EthbatMode,
  EthbatPlacement,
  EthbatPluginSettings,
  EthbatTheme,
} from "./types";

const MODES = new Set<EthbatMode>(["carousel", "grid", "badge"]);
const LANGUAGES = new Set<EthbatLanguage>(["ar", "en"]);
const THEMES = new Set<EthbatTheme>(["light", "dark"]);
const KINDS = new Set<EthbatKind>(["", "text", "image", "video"]);
const STORE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const DEFAULT_ETHBAT_DISPLAY: EthbatDisplaySettings = {
  mode: "grid",
  limit: 6,
  lang: "ar",
  theme: "light",
  kind: "",
};

export const DEFAULT_ETHBAT_SETTINGS: EthbatPluginSettings = {
  version: 1,
  enabled: true,
  storeSlug: "store-c53b0dc45e",
  defaults: DEFAULT_ETHBAT_DISPLAY,
  placements: {
    home: {
      enabled: true,
      useDefaults: true,
      display: DEFAULT_ETHBAT_DISPLAY,
    },
    product: {
      enabled: false,
      useDefaults: true,
      display: DEFAULT_ETHBAT_DISPLAY,
    },
  },
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function cleanEnum<T extends string>(
  value: unknown,
  allowed: ReadonlySet<T>,
  fallback: T,
): T {
  const cleaned = cleanString(value) as T;
  return allowed.has(cleaned) ? cleaned : fallback;
}

function cleanLimit(value: unknown, fallback: number): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number)) return fallback;
  return Math.min(50, Math.max(1, number));
}

export function sanitizeStoreSlug(value: unknown): string {
  return cleanString(value).toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function sanitizeDisplaySettings(
  value: unknown,
  fallback = DEFAULT_ETHBAT_DISPLAY,
): EthbatDisplaySettings {
  const input =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    mode: cleanEnum(input.mode, MODES, fallback.mode),
    limit: cleanLimit(input.limit, fallback.limit),
    lang: cleanEnum(input.lang, LANGUAGES, fallback.lang),
    theme: cleanEnum(input.theme, THEMES, fallback.theme),
    kind: cleanEnum(input.kind, KINDS, fallback.kind),
  };
}

export function sanitizeEthbatSettings(value: unknown): EthbatPluginSettings {
  const input =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const defaults = sanitizeDisplaySettings(input.defaults);
  const placements =
    input.placements && typeof input.placements === "object"
      ? (input.placements as Record<string, unknown>)
      : {};

  const cleanPlacement = (placement: EthbatPlacement) => {
    const raw =
      placements[placement] && typeof placements[placement] === "object"
        ? (placements[placement] as Record<string, unknown>)
        : {};
    const fallback = DEFAULT_ETHBAT_SETTINGS.placements[placement];

    return {
      enabled: cleanBoolean(raw.enabled, fallback.enabled),
      useDefaults: cleanBoolean(raw.useDefaults, fallback.useDefaults),
      display: sanitizeDisplaySettings(raw.display, defaults),
    };
  };

  return {
    version: 1,
    enabled: cleanBoolean(input.enabled, DEFAULT_ETHBAT_SETTINGS.enabled),
    storeSlug:
      sanitizeStoreSlug(input.storeSlug) ||
      DEFAULT_ETHBAT_SETTINGS.storeSlug,
    defaults,
    placements: {
      home: cleanPlacement("home"),
      product: cleanPlacement("product"),
    },
  };
}

export function validateEthbatSettings(value: unknown): {
  settings?: EthbatPluginSettings;
  fieldErrors?: Record<string, string>;
} {
  const settings = sanitizeEthbatSettings(value);
  const errors: Record<string, string> = {};

  if (!STORE_SLUG_PATTERN.test(settings.storeSlug)) {
    errors.storeSlug =
      "استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط.";
  }
  if (settings.storeSlug.length > 100) {
    errors.storeSlug = "Store slug يجب ألا يتجاوز 100 حرف.";
  }

  return Object.keys(errors).length > 0
    ? { fieldErrors: errors }
    : { settings };
}

export function resolvePlacementDisplay(
  settings: EthbatPluginSettings,
  placement: EthbatPlacement,
  locale?: EthbatLanguage,
): EthbatDisplaySettings {
  const placementSettings = settings.placements[placement];
  const display = placementSettings.useDefaults
    ? settings.defaults
    : placementSettings.display;

  return sanitizeDisplaySettings({
    ...display,
    lang: locale ?? display.lang,
  });
}
