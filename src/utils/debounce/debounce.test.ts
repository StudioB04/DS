import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import debounce from "./debounce";

describe("debounce util", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should wait for the delay before invoking the callback", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("first call");

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first call");
  });

  it("should reset the timer when called again before the wait time", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("first call");

    vi.advanceTimersByTime(50);
    debounced("second call");

    vi.advanceTimersByTime(99);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second call");
  });

  it("should only invoke the callback once with the latest arguments after a burst of calls", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("first call");
    debounced("second call");
    debounced("latest call");

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("latest call");
  });

  it("should cancel a pending callback", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("canceled");
    debounced.cancel();
    debounced.cancel();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("should allow scheduling again after cancellation", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("canceled");
    debounced.cancel();
    debounced("next call");
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledExactlyOnceWith("next call");
  });
});
