import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import throttle from "./throttle";

describe("throttle util", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should call the function immediately on the first invocation", () => {
    const callback = vi.fn();
    const throttled = throttle(callback, 100);

    throttled("first call");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first call");
  });

  it("should queue a delayed invocation when called again before the wait time", () => {
    const callback = vi.fn();
    const throttled = throttle(callback, 100);

    throttled("first call");
    throttled("queued call");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenNthCalledWith(1, "first call");

    vi.advanceTimersByTime(99);

    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(2, "queued call");
  });

  it("should keep a single queued timeout and allow a new immediate call after the wait window", () => {
    const callback = vi.fn();
    const throttled = throttle(callback, 100);

    throttled("first call");

    vi.advanceTimersByTime(20);
    throttled("queued call");
    throttled("ignored while queued");

    vi.advanceTimersByTime(80);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, "first call");
    expect(callback).toHaveBeenNthCalledWith(2, "queued call");

    vi.advanceTimersByTime(100);
    throttled("new window");

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(3, "new window");
  });
});
