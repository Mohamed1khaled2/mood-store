"use server";

import { revalidatePath } from "next/cache";
import { getDb, saveDb } from "@/data/db";
import { validateEthbatSettings } from "@/plugins/ethbat-reviews/config";
import type {
  EthbatActionResult,
  EthbatPluginSettings,
} from "@/plugins/ethbat-reviews/types";

export async function updateEthbatSettings(
  input: EthbatPluginSettings,
): Promise<EthbatActionResult> {
  const validation = validateEthbatSettings(input);
  if (!validation.settings) {
    return {
      ok: false,
      message: "راجع القيم المرسلة وحاول مرة أخرى.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const db = await getDb();
  db.ethbatReviews = validation.settings;
  await saveDb(db);

  revalidatePath("/admin/ethbat-reviews");
  revalidatePath("/ar");
  revalidatePath("/en");

  return { ok: true, message: "تم حفظ إعدادات إثبات بنجاح." };
}
