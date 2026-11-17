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
    vi.unstubAllGlobals();
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

  describe("ResizeObserver", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const created = vi.fn();
    let notify: () => void;

    beforeEach(() => {
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            created();
            notify = callback;
          }
          observe = observe;
          disconnect = disconnect;
        },
      );
    });

    it("should observe the source element with the border-box size", () => {
      const sourceElement = document.createElement("div");
      const targetElement = document.createElement("div");

      const cleanup = setHTMLCustomProp(sourceElement, "clientHeight", "--custom-height", targetElement);

      expect(created).toHaveBeenCalledTimes(1);
      expect(observe).toHaveBeenCalledWith(sourceElement, { box: "border-box" });

      cleanup();
    });

    it("should update the custom property as soon as the element is resized", () => {
      const sourceElement = document.createElement("div");
      const targetElement = document.createElement("div");

      defineElementProperty(sourceElement, "clientHeight", 20);

      const cleanup = setHTMLCustomProp(sourceElement, "clientHeight", "--custom-height", targetElement);

      defineElementProperty(sourceElement, "clientHeight", 80);
      notify();

      expect(targetElement.style.getPropertyValue("--custom-height")).toBe("80px");

      cleanup();
    });

    it("should disconnect the observer on cleanup", () => {
      const cleanup = setHTMLCustomProp(document.createElement("div"), "clientHeight", "--custom-height");

      expect(disconnect).not.toHaveBeenCalled();

      cleanup();

      expect(disconnect).toHaveBeenCalledTimes(1);
    });

    it("should not create an observer when the source element is null", () => {
      const cleanup = setHTMLCustomProp(null, "clientHeight", "--custom-height");

      expect(created).not.toHaveBeenCalled();
      expect(observe).not.toHaveBeenCalled();

      cleanup();

      expect(disconnect).not.toHaveBeenCalled();
    });

    it("should work when ResizeObserver is not supported", () => {
      vi.stubGlobal("ResizeObserver", undefined);
      const sourceElement = document.createElement("div");
      const targetElement = document.createElement("div");

      defineElementProperty(sourceElement, "clientHeight", 12);

      const cleanup = setHTMLCustomProp(sourceElement, "clientHeight", "--custom-height", targetElement);

      expect(targetElement.style.getPropertyValue("--custom-height")).toBe("12px");
      expect(() => cleanup()).not.toThrow();
      expect(created).not.toHaveBeenCalled();
    });
  });
});
