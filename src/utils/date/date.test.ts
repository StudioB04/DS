import { afterEach, describe, expect, it, vi } from "vitest";

import { formatDate } from "./date";

describe("date util", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe("without Temporal", () => {
    it("should format an ISO date with a capital on every word", () => {
      vi.stubGlobal("Temporal", undefined);
      expect(formatDate("fr-FR", "2026-11-24")).toBe("Mardi 24 Novembre 2026");
      expect(formatDate("en-US", "2026-11-24")).toBe("Tuesday, November 24, 2026");
      expect(formatDate("es-ES", "2026-01-05")).toBe("Lunes, 5 De Enero De 2026");
    });

    it("should format today when no date is given", () => {
      vi.stubGlobal("Temporal", undefined);
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 10, 24, 12));
      expect(formatDate("fr-FR")).toBe("Mardi 24 Novembre 2026");
    });

    it("should default to English when no locale is given", () => {
      vi.stubGlobal("Temporal", undefined);
      expect(formatDate(undefined, "2026-11-24")).toBe("Tuesday, November 24, 2026");
    });

    it("should throw on an invalid date", () => {
      vi.stubGlobal("Temporal", undefined);
      expect(() => formatDate("fr-FR", "nope")).toThrow(RangeError);
    });
  });

  describe("with Temporal", () => {
    it("should format the given date through Temporal.PlainDate", () => {
      const from = vi.fn((isoDate: string) => ({
        toLocaleString: (locale: string, options?: Intl.DateTimeFormatOptions) =>
          `${isoDate} ${locale} ${options?.weekday ?? ""}`,
      }));
      vi.stubGlobal("Temporal", { Now: { plainDateISO: vi.fn() }, PlainDate: { from } });
      expect(formatDate("fr-FR", "2026-11-24")).toBe("2026-11-24 Fr-FR Long");
      expect(from).toHaveBeenCalledWith("2026-11-24");
    });

    it("should format today through Temporal.Now", () => {
      const plainDateISO = vi.fn(() => ({ toLocaleString: () => "mardi 24 novembre 2026" }));
      vi.stubGlobal("Temporal", { Now: { plainDateISO }, PlainDate: { from: vi.fn() } });
      expect(formatDate("fr-FR")).toBe("Mardi 24 Novembre 2026");
      expect(plainDateISO).toHaveBeenCalledOnce();
    });
  });
});
