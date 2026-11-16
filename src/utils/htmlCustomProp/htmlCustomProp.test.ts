import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setHTMLCustomProp } from "./htmlCustomProp";

function defineElementProperty(element: HTMLElement, property: keyof HTMLElement, value: number) {
  Object.defineProperty(element, property, {
    configurable: true,
    value,
  });
}

describe("htmlCustomProp util", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.documentElement.style.removeProperty("--custom-height");
    document.documentElement.style.removeProperty("--custom-width");
  });

  it("should set the custom property immediately on the provided target element", () => {
    const sourceElement = document.createElement("div");
    const targetElement = document.createElement("div");

    defineElementProperty(sourceElement, "clientHeight", 42);

    const cleanup = setHTMLCustomProp(sourceElement, "clientHeight", "--custom-height", targetElement);

    expect(targetElement.style.getPropertyValue("--custom-height")).toBe("42px");

    cleanup();
  });

  it("should update the custom property on resize after the debounce delay", () => {
    const sourceElement = document.createElement("div");
    const targetElement = document.createElement("div");

    defineElementProperty(sourceElement, "clientHeight", 24);

    const cleanup = setHTMLCustomProp(sourceElement, "clientHeight", "--custom-height", targetElement);

    defineElementProperty(sourceElement, "clientHeight", 64);
    globalThis.dispatchEvent(new Event("resize"));

    expect(targetElement.style.getPropertyValue("--custom-height")).toBe("24px");

    vi.advanceTimersByTime(100);

    expect(targetElement.style.getPropertyValue("--custom-height")).toBe("64px");

    cleanup();
  });

  it("should set 0px when the source element is null", () => {
    const targetElement = document.createElement("div");

    const cleanup = setHTMLCustomProp(null, "clientHeight", "--custom-height", targetElement);

    expect(targetElement.style.getPropertyValue("--custom-height")).toBe("0px");

    cleanup();
  });

  it("should not throw when the target element is null", () => {
    const sourceElement = document.createElement("div");

    defineElementProperty(sourceElement, "clientHeight", 42);

    expect(() => {
      const cleanup = setHTMLCustomProp(sourceElement, "clientHeight", "--custom-height", null);
      globalThis.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(100);
      cleanup();
    }).not.toThrow();
  });

  it("should use the document element by default and remove the resize listener on cleanup", () => {
    const sourceElement = document.createElement("div");

    defineElementProperty(sourceElement, "clientWidth", 30);

    const cleanup = setHTMLCustomProp(sourceElement, "clientWidth", "--custom-width");

    expect(document.documentElement.style.getPropertyValue("--custom-width")).toBe("30px");

    defineElementProperty(sourceElement, "clientWidth", 48);
    cleanup();

    expect(document.documentElement.style.getPropertyValue("--custom-width")).toBe("48px");

    defineElementProperty(sourceElement, "clientWidth", 96);
    globalThis.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(100);

    expect(document.documentElement.style.getPropertyValue("--custom-width")).toBe("48px");
  });
});
