import { ETHBAT_WIDGET_URL } from "./types";
import type { EthbatDisplaySettings } from "./types";
import { sanitizeDisplaySettings, sanitizeStoreSlug } from "./config";

export type EthbatScriptAttributes = {
  src: typeof ETHBAT_WIDGET_URL;
  "data-store": string;
  "data-mode": string;
  "data-limit": string;
  "data-lang": string;
  "data-theme": string;
  "data-kind"?: string;
};

export function buildEthbatScriptAttributes(
  storeSlug: string,
  display: EthbatDisplaySettings,
): EthbatScriptAttributes {
  const safeSlug = sanitizeStoreSlug(storeSlug);
  if (!safeSlug) throw new Error("A valid Ethbat store slug is required.");

  const safeDisplay = sanitizeDisplaySettings(display);
  return {
    src: ETHBAT_WIDGET_URL,
    "data-store": safeSlug,
    "data-mode": safeDisplay.mode,
    "data-limit": String(safeDisplay.limit),
    "data-lang": safeDisplay.lang,
    "data-theme": safeDisplay.theme,
    ...(safeDisplay.kind ? { "data-kind": safeDisplay.kind } : {}),
  };
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function buildEthbatEmbedCode(
  storeSlug: string,
  display: EthbatDisplaySettings,
): string {
  const attributes = buildEthbatScriptAttributes(storeSlug, display);
  return `<script ${Object.entries(attributes)
    .map(([name, value]) => `${name}="${escapeAttribute(value)}"`)
    .join(" ")}></script>`;
}
