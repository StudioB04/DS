import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useWindowSize } from "./useWindowSize";

describe("useWindowSize", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("reads the initial window dimensions and breakpoints", () => {
    vi.stubGlobal("innerWidth", 1024);
    vi.stubGlobal("innerHeight", 768);
    const matchMedia = globalThis.matchMedia;
    vi.spyOn(globalThis, "matchMedia").mockImplementation((query) => ({
      ...matchMedia(query),
      matches: Number(query.match(/\d+/)?.[0]) <= globalThis.innerWidth,
    }));

    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
      isSm: true,
      isMd: true,
      isLg: false,
      isXl: false,
    });
  });

  it("debounces resize events and uses the latest window dimensions", () => {
    vi.stubGlobal("innerWidth", 800);
    vi.stubGlobal("innerHeight", 600);
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      vi.stubGlobal("innerWidth", 1000);
      globalThis.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(50);
      vi.stubGlobal("innerWidth", 1200);
      vi.stubGlobal("innerHeight", 900);
      globalThis.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(99);
    });
    expect(result.current.width).toBe(800);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(900);
  });

  it("removes the registered resize listener on unmount", () => {
    const addListener = vi.spyOn(globalThis, "addEventListener");
    const removeListener = vi.spyOn(globalThis, "removeEventListener");
    const { unmount } = renderHook(() => useWindowSize());
    const resizeListener = addListener.mock.calls.find(([event]) => event === "resize")?.[1];

    expect(resizeListener).toBeDefined();
    unmount();

    expect(removeListener).toHaveBeenCalledWith("resize", resizeListener);
    globalThis.dispatchEvent(new Event("resize"));
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels a pending resize update on unmount", () => {
    const matchMedia = vi.spyOn(globalThis, "matchMedia");
    const { unmount } = renderHook(() => useWindowSize());
    globalThis.dispatchEvent(new Event("resize"));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    matchMedia.mockClear();

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(100));
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
