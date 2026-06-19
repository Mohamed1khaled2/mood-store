export const ETHBAT_WIDGET_URL =
  "https://ethbat.vercel.app/widget/ethbat-widget.js" as const;
export const ETHBAT_API_ORIGIN = "https://ethbat.vercel.app" as const;

export type EthbatMode = "carousel" | "grid" | "badge";
export type EthbatLanguage = "ar" | "en";
export type EthbatTheme = "light" | "dark";
export type EthbatKind = "" | "text" | "image" | "video";

export type EthbatDisplaySettings = {
  mode: EthbatMode;
  limit: number;
  lang: EthbatLanguage;
  theme: EthbatTheme;
  kind: EthbatKind;
};

export type EthbatPlacementSettings = {
  enabled: boolean;
  useDefaults: boolean;
  display: EthbatDisplaySettings;
};

export type EthbatPluginSettings = {
  version: 1;
  enabled: boolean;
  storeSlug: string;
  defaults: EthbatDisplaySettings;
  placements: {
    home: EthbatPlacementSettings;
    product: EthbatPlacementSettings;
  };
};

export type EthbatPlacement = keyof EthbatPluginSettings["placements"];

export type EthbatActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};
