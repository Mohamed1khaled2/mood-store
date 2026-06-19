"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildEthbatScriptAttributes } from "./embed";
import { mountEthbatScript, unmountEthbatScript } from "./loader";
import type { EthbatDisplaySettings } from "./types";

type Props = {
  storeSlug: string;
  display: EthbatDisplaySettings;
  className?: string;
  heading?: string;
};

type WidgetState = "loading" | "ready" | "empty" | "error";

const MESSAGES = {
  ar: {
    loading: "جاري تحميل تقييمات العملاء…",
    empty: "لا توجد تقييمات منشورة بعد.",
    error: "تعذر تحميل التقييمات. حاول مرة أخرى لاحقًا.",
    label: "تقييمات العملاء من إثبات",
  },
  en: {
    loading: "Loading customer reviews…",
    empty: "No published reviews yet.",
    error: "Reviews could not be loaded. Please try again later.",
    label: "Customer reviews from Ethbat",
  },
};

export default function EthbatWidgetBlock({
  storeSlug,
  display,
  className = "",
  heading,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<WidgetState>("loading");
  const attributes = useMemo(
    () => buildEthbatScriptAttributes(storeSlug, display),
    [display, storeSlug],
  );
  const text = MESSAGES[display.lang];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const controller = new AbortController();
    let observer: MutationObserver | undefined;
    let widgetMounted = false;

    setState("loading");

    if (process.env.NODE_ENV === "development") {
      fetch(
        `https://ethbat.vercel.app/api/widget/${encodeURIComponent(
          attributes["data-store"],
        )}?limit=${attributes["data-limit"]}${
          attributes["data-kind"]
            ? `&kind=${encodeURIComponent(attributes["data-kind"])}`
            : ""
        }`,
        { signal: controller.signal },
      )
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Ethbat API returned ${response.status}`);
          }
          const data = (await response.json()) as { reviews?: unknown[] };
          setState(
            widgetMounted ? "ready" : data.reviews?.length ? "ready" : "empty",
          );
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error("[Ethbat] Widget API preflight failed.", error);
          setState("error");
        });
    }

    try {
      const script = mountEthbatScript(host, attributes, () =>
        setState("error"),
      );
      observer = new MutationObserver(() => {
        if (script.previousElementSibling) {
          widgetMounted = true;
          setState("ready");
        }
      });
      observer.observe(host, { childList: true });
    } catch (error) {
      console.error(error);
      queueMicrotask(() => setState("error"));
    }

    return () => {
      controller.abort();
      observer?.disconnect();
      unmountEthbatScript(host);
    };
  }, [attributes]);

  return (
    <section
      className={`ethbat-plugin-shell ${className}`}
      dir={display.lang === "ar" ? "rtl" : "ltr"}
      aria-label={heading || text.label}
    >
      {heading ? <h2 className="ethbat-plugin-heading">{heading}</h2> : null}
      <div ref={hostRef} className="ethbat-plugin-host" />
      <p
        className={`ethbat-plugin-status ethbat-plugin-status--${state}`}
        role={state === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {state === "loading" ? text.loading : null}
        {state === "empty" ? text.empty : null}
        {state === "error" ? text.error : null}
      </p>
    </section>
  );
}
