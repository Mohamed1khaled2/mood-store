import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEthbatEmbedCode,
  buildEthbatScriptAttributes,
} from "../plugins/ethbat-reviews/embed";
import { DEFAULT_ETHBAT_DISPLAY } from "../plugins/ethbat-reviews/config";

test("generates the exact default script attributes", () => {
  assert.deepEqual(
    buildEthbatScriptAttributes(
      "store-c53b0dc45e",
      DEFAULT_ETHBAT_DISPLAY,
    ),
    {
      src: "https://ethbat.vercel.app/widget/ethbat-widget.js",
      "data-store": "store-c53b0dc45e",
      "data-mode": "grid",
      "data-limit": "6",
      "data-lang": "ar",
      "data-theme": "light",
    },
  );
});

test("includes an optional kind and escapes generated markup", () => {
  const code = buildEthbatEmbedCode("store-demo", {
    ...DEFAULT_ETHBAT_DISPLAY,
    kind: "video",
  });

  assert.match(code, /data-kind="video"/);
  assert.match(code, /^<script /);
  assert.match(code, /src="https:\/\/ethbat\.vercel\.app\/widget\/ethbat-widget\.js"/);
  assert.match(code, /data-store="store-demo"/);
  assert.match(code, /<\/script>$/);
});
