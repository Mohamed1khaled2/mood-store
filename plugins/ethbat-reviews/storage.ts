import { getDb } from "@/data/db";
import {
  DEFAULT_ETHBAT_SETTINGS,
  sanitizeEthbatSettings,
} from "./config";
import type { EthbatPluginSettings } from "./types";

export async function getEthbatSettings(): Promise<EthbatPluginSettings> {
  const db = await getDb();
  return db.ethbatReviews
    ? sanitizeEthbatSettings(db.ethbatReviews)
    : DEFAULT_ETHBAT_SETTINGS;
}
