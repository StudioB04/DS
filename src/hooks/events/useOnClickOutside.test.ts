import { fireEvent, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useOnClickOutside from "./useOnClickOutside";

describe("useOnClickOutside", () => {
  let container: HTMLDivElement;
  let inside: HTMLButtonElement;
  let outside: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement("div");
    inside = document.createElement("button");
    outside = document.createElement("button");
    container.append(inside);
    document.body.append(container, outside);
  });

  afterEach(() => {
    container.remove();
    outside.remove();
  });

  it("calls the callback with the event when the mouse is pressed outside of the element", () => {
    const callback = vi.fn();
    renderHook(() => useOnClickOutside({ current: container }, callback));

    fireEvent.mouseDown(outside);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ type: "mousedown", target: outside }));
  });

  it("does not call the callback when the mouse is pressed on the element itself", () => {
    const callback = vi.fn();
    renderHook(() => useOnClickOutside({ current: container }, callback));

    fireEvent.mouseDown(container);

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call the callback when the mouse is pressed inside of the element", () => {
    const callback = vi.fn();
    renderHook(() => useOnClickOutside({ current: container }, callback));

    fireEvent.mouseDown(inside);

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call the callback when the ref is empty", () => {
    const callback = vi.fn();
    renderHook(() => useOnClickOutside({ current: null }, callback));

    fireEvent.mouseDown(outside);

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls the latest callback after a re-render", () => {
    const ref = { current: container };
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => useOnClickOutside(ref, callback), {
      initialProps: { callback: first },
    });

    rerender({ callback: second });
    fireEvent.mouseDown(outside);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const callback = vi.fn();
    const removeListener = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useOnClickOutside({ current: container }, callback));

    unmount();
    fireEvent.mouseDown(outside);

    expect(removeListener).toHaveBeenCalledWith("mousedown", expect.any(Function));
    expect(callback).not.toHaveBeenCalled();
  });
});
