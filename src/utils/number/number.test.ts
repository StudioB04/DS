import { describe, expect, it } from "vitest";

import { shorten, shortenFileSize } from "./number";

describe("number util", () => {
  it("should shorten numbers correctly", () => {
    expect(shorten(1000, 0)).toBe("1K");
    expect(shorten(1500, 1)).toBe("1.5K");
    expect(shorten(1000000, 0)).toBe("1M");
    expect(shorten(2500000, 1)).toBe("2.5M");
    expect(shorten(1000000000, 0)).toBe("1B");
    expect(shorten(1000000000000, 0)).toBe("1e+12");
  });

  it("should use 2 decimals by default", () => {
    expect(shorten(1550)).toBe("1.55K");
    expect(shorten(1550000)).toBe("1.55M");
    expect(shorten(1550000000)).toBe("1.55B");
    expect(shorten(1550000000000)).toBe("1.55e+12");
  });

  it("should return numbers below 1000 as they are", () => {
    expect(shorten(0)).toBe("0");
    expect(shorten(12.5)).toBe("12.5");
    expect(shorten(999)).toBe("999");
  });

  it("should keep the sign of negative numbers", () => {
    expect(shorten(-42)).toBe("-42");
    expect(shorten(-1500, 1)).toBe("-1.5K");
    expect(shorten(-2500000, 1)).toBe("-2.5M");
  });

  it("should shorten file sizes correctly", () => {
    expect(shortenFileSize(1560, 2)).toBe("1.52 Kb");
    expect(shortenFileSize(1980987, 3)).toBe("1.889 Mb");
    expect(shortenFileSize(1987665868, 1)).toBe("1.9 Gb");
    expect(shortenFileSize(1099511627776, 0)).toBe("1 Tb");
    expect(shortenFileSize(1125899906842624, 0)).toBe("1 Pb");
  });

  it("should use 2 decimals by default for file sizes", () => {
    expect(shortenFileSize(500)).toBe("500 B");
    expect(shortenFileSize(1560)).toBe("1.52 Kb");
  });

  it("should throw when the file size is negative", () => {
    expect(() => shortenFileSize(-1)).toThrow("File size cannot be negative");
  });
});
