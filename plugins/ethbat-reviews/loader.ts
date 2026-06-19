import type { EthbatScriptAttributes } from "./embed";

export const ETHBAT_SCRIPT_ID = "ethbat-reviews-widget-script";

type LoaderWindow = Window & {
  __ethbatWidgetOwner?: HTMLElement;
};

function findGeneratedContainer(script: HTMLScriptElement): HTMLElement | null {
  const previous = script.previousElementSibling;
  return previous instanceof HTMLElement ? previous : null;
}

export function mountEthbatScript(
  host: HTMLElement,
  attributes: EthbatScriptAttributes,
): HTMLScriptElement {
  const scopedWindow = window as LoaderWindow;
  const existing = document.getElementById(ETHBAT_SCRIPT_ID);

  if (existing instanceof HTMLScriptElement) {
    if (scopedWindow.__ethbatWidgetOwner === host) return existing;
    throw new Error(
      "[Ethbat] The widget script is already mounted on this page. Enable one placement per page.",
    );
  }

  const script = document.createElement("script");
  script.id = ETHBAT_SCRIPT_ID;
  script.async = true;
  Object.entries(attributes).forEach(([name, value]) => {
    script.setAttribute(name, value);
  });
  script.addEventListener("error", (event) => {
    console.error("[Ethbat] Failed to load the widget script.", event);
  });

  scopedWindow.__ethbatWidgetOwner = host;
  host.appendChild(script);
  return script;
}

export function unmountEthbatScript(host: HTMLElement): void {
  const scopedWindow = window as LoaderWindow;
  const script = host.querySelector<HTMLScriptElement>(
    `#${ETHBAT_SCRIPT_ID}`,
  );

  if (script) {
    findGeneratedContainer(script)?.remove();
    script.remove();
  }
  if (scopedWindow.__ethbatWidgetOwner === host) {
    delete scopedWindow.__ethbatWidgetOwner;
  }
}
