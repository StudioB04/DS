import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useOnScroll from "./useOnScroll";

describe("useOnScroll", () => {
  it("calls the callback when the element of the ref scrolls", () => {
    const element = document.createElement("div");
    const callback = vi.fn();
    renderHook(() => useOnScroll({ current: element }, callback));

    fireEvent.scroll(element);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls the callback when the window scrolls", () => {
    const callback = vi.fn();
    renderHook(() => useOnScroll(window, callback));

    fireEvent.scroll(window);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("listens to the window by default", () => {
    const callback = vi.fn();
    renderHook(() => useOnScroll(undefined, callback));

    fireEvent.scroll(window);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does nothing while the ref is empty", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useOnScroll({ current: null }, callback));

    fireEvent.scroll(window);

    expect(callback).not.toHaveBeenCalled();
    expect(() => unmount()).not.toThrow();
  });

  it("does not react to the scroll of another element", () => {
    const element = document.createElement("div");
    const other = document.createElement("div");
    const callback = vi.fn();
    renderHook(() => useOnScroll({ current: element }, callback));

    fireEvent.scroll(other);

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls the latest callback after a re-render", () => {
    const ref = { current: document.createElement("div") };
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => useOnScroll(ref, callback), {
      initialProps: { callback: first },
    });

    rerender({ callback: second });
    fireEvent.scroll(ref.current);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const element = document.createElement("div");
    const callback = vi.fn();
    const removeListener = vi.spyOn(element, "removeEventListener");
    const { unmount } = renderHook(() => useOnScroll({ current: element }, callback));

    unmount();
    fireEvent.scroll(element);

    expect(removeListener).toHaveBeenCalledWith("scroll", callback);
    expect(callback).not.toHaveBeenCalled();
  });
});
