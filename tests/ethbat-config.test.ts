import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ETHBAT_SETTINGS,
  sanitizeEthbatSettings,
  validateEthbatSettings,
} from "../plugins/ethbat-reviews/config";

test("uses the requested embed defaults", () => {
  assert.deepEqual(DEFAULT_ETHBAT_SETTINGS.defaults, {
    mode: "grid",
    limit: 6,
    lang: "ar",
    theme: "light",
    kind: "",
  });
  assert.equal(DEFAULT_ETHBAT_SETTINGS.storeSlug, "store-c53b0dc45e");
});

test("sanitizes enums, slug, and clamps limits", () => {
  const settings = sanitizeEthbatSettings({
    storeSlug: " STORE-c53b0dc45e<script> ",
    defaults: {
      mode: "invalid",
      limit: 500,
      lang: "fr",
      theme: "neon",
      kind: "audio",
    },
  });

  assert.equal(settings.storeSlug, "store-c53b0dc45escript");
  assert.equal(settings.defaults.mode, "grid");
  assert.equal(settings.defaults.limit, 50);
  assert.equal(settings.defaults.lang, "ar");
  assert.equal(settings.defaults.theme, "light");
  assert.equal(settings.defaults.kind, "");
});

test("rejects malformed store slugs after sanitization", () => {
  const result = validateEthbatSettings({ storeSlug: "---" });
  assert.equal(result.settings, undefined);
  assert.ok(result.fieldErrors?.storeSlug);
});
