import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useOnEscape from "./useOnEscape";

describe("useOnEscape", () => {
  it("calls the callback when Escape is pressed", () => {
    const callback = vi.fn();
    renderHook(() => useOnEscape(callback));

    fireEvent.keyDown(document.body, { key: "Escape" });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("ignores the other keys", () => {
    const callback = vi.fn();
    renderHook(() => useOnEscape(callback));

    fireEvent.keyDown(document.body, { key: "Enter" });
    fireEvent.keyDown(document.body, { key: "a" });

    expect(callback).not.toHaveBeenCalled();
  });

  it("removes the focus from the element that received the key", () => {
    const button = document.createElement("button");
    document.body.append(button);
    button.focus();
    renderHook(() => useOnEscape(vi.fn()));
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Escape" });

    expect(button).not.toHaveFocus();
    button.remove();
  });

  it("calls the latest callback after a re-render", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => useOnEscape(callback), { initialProps: { callback: first } });

    rerender({ callback: second });
    fireEvent.keyDown(document.body, { key: "Escape" });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const callback = vi.fn();
    const removeListener = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useOnEscape(callback));

    unmount();
    fireEvent.keyDown(document.body, { key: "Escape" });

    expect(removeListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(callback).not.toHaveBeenCalled();
  });
});
