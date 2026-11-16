import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useOnResize from "./useOnResize";

function resize() {
  act(() => {
    globalThis.dispatchEvent(new Event("resize"));
  });
}

describe("useOnResize", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("calls the callback 100 ms after the window is resized", () => {
    const callback = vi.fn();
    renderHook(() => useOnResize(callback));

    resize();
    vi.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls the callback only once for a burst of resize events", () => {
    const callback = vi.fn();
    renderHook(() => useOnResize(callback));

    resize();
    vi.advanceTimersByTime(50);
    resize();
    vi.advanceTimersByTime(50);
    resize();
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls the latest callback after a re-render", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => useOnResize(callback), { initialProps: { callback: first } });

    rerender({ callback: second });
    resize();
    vi.advanceTimersByTime(100);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes the registered listener on unmount", () => {
    const addListener = vi.spyOn(globalThis, "addEventListener");
    const removeListener = vi.spyOn(globalThis, "removeEventListener");
    const { unmount } = renderHook(() => useOnResize(vi.fn()));
    const listener = addListener.mock.calls.find(([event]) => event === "resize")?.[1];

    unmount();

    expect(listener).toBeDefined();
    expect(removeListener).toHaveBeenCalledWith("resize", listener);
  });

  it("cancels a pending call on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useOnResize(callback));

    resize();
    unmount();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });
});
