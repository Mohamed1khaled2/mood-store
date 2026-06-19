import test from "node:test";
import assert from "node:assert/strict";
import {
  ETHBAT_SCRIPT_ID,
  mountEthbatScript,
  unmountEthbatScript,
} from "../plugins/ethbat-reviews/loader";
import { buildEthbatScriptAttributes } from "../plugins/ethbat-reviews/embed";
import { DEFAULT_ETHBAT_DISPLAY } from "../plugins/ethbat-reviews/config";

class FakeElement {
  id = "";
  children: FakeElement[] = [];
  parent?: FakeElement;
  attributes = new Map<string, string>();
  previousElementSibling: FakeElement | null = null;

  appendChild(child: FakeElement) {
    child.parent = this;
    child.previousElementSibling = this.children.at(-1) ?? null;
    this.children.push(child);
    return child;
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  addEventListener() {}

  querySelector<T extends FakeElement>(selector: string): T | null {
    if (selector === `#${ETHBAT_SCRIPT_ID}`) {
      return (this.children.find((child) => child.id === ETHBAT_SCRIPT_ID) ??
        null) as T | null;
    }
    return null;
  }

  remove() {
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter((child) => child !== this);
  }
}

class FakeScriptElement extends FakeElement {
  async = false;
}

class FakeDocument {
  roots: FakeElement[] = [];

  createElement(tag: string) {
    return tag === "script" ? new FakeScriptElement() : new FakeElement();
  }

  getElementById(id: string) {
    const walk = (element: FakeElement): FakeElement | null => {
      if (element.id === id) return element;
      for (const child of element.children) {
        const match = walk(child);
        if (match) return match;
      }
      return null;
    };
    for (const root of this.roots) {
      const match = walk(root);
      if (match) return match;
    }
    return null;
  }
}

test("mounts one script only and cleans up its owned node", () => {
  const document = new FakeDocument();
  const firstHost = new FakeElement();
  const secondHost = new FakeElement();
  document.roots.push(firstHost, secondHost);

  Object.assign(globalThis, {
    document,
    window: {},
    HTMLElement: FakeElement,
    HTMLScriptElement: FakeScriptElement,
  });

  const attributes = buildEthbatScriptAttributes(
    "store-c53b0dc45e",
    DEFAULT_ETHBAT_DISPLAY,
  );
  const first = mountEthbatScript(
    firstHost as unknown as HTMLElement,
    attributes,
  );
  const repeated = mountEthbatScript(
    firstHost as unknown as HTMLElement,
    attributes,
  );

  assert.equal(first, repeated);
  assert.equal(firstHost.children.length, 1);
  assert.throws(
    () =>
      mountEthbatScript(secondHost as unknown as HTMLElement, attributes),
    /already mounted/,
  );

  unmountEthbatScript(firstHost as unknown as HTMLElement);
  assert.equal(firstHost.children.length, 0);
});
