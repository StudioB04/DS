import { capitalize } from "$utils";

/** The part of a `Temporal.PlainDate` used here (TypeScript 5 ships no Temporal types). */
interface TemporalPlainDate {
  toLocaleString(locale: string, options?: Intl.DateTimeFormatOptions): string;
}

/** The part of the global `Temporal` object used here. */
interface TemporalApi {
  Now: { plainDateISO(): TemporalPlainDate };
  PlainDate: { from(isoDate: string): TemporalPlainDate };
}

/** Intl options for a long date, e.g. "Tuesday, November 24, 2026". */
const LONG_DATE: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };

/**
 * Formats a date through the Temporal API.
 * @param {TemporalApi} temporal The global `Temporal` object.
 * @param {string} locale The locale (BCP 47 tag) of the result.
 * @param {string} [isoDate] A date written "YYYY-MM-DD". Without it, today's date.
 * @returns {string} The long date, not capitalized yet.
 * @throws {RangeError} When `isoDate` is not a valid date.
 */
function formatWithTemporal(temporal: TemporalApi, locale: string, isoDate?: string): string {
  const date = isoDate === undefined ? temporal.Now.plainDateISO() : temporal.PlainDate.from(isoDate);
  return date.toLocaleString(locale, LONG_DATE);
}

/**
 * Formats a date through `Date`, for environments without the Temporal API.
 * A date-only ISO string ("2026-11-24") is parsed as UTC, so formatting in UTC keeps it from moving back a day.
 * Without a date, it is today in local time.
 * @param {string} locale The locale (BCP 47 tag) of the result.
 * @param {string} [isoDate] A date written "YYYY-MM-DD". Without it, today's date.
 * @returns {string} The long date, not capitalized yet.
 * @throws {RangeError} When `isoDate` is not a valid date.
 */
function formatWithDate(locale: string, isoDate?: string): string {
  if (isoDate === undefined) {
    return new Date().toLocaleDateString(locale, LONG_DATE);
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid ISO date: ${isoDate}`);
  }

  return date.toLocaleDateString(locale, { ...LONG_DATE, timeZone: "UTC" });
}

/**
 * Long date in the requested locale, with a capital letter on every word ("Mardi 24 Novembre 2026").
 * Without `isoDate` ("YYYY-MM-DD"), it is today's date. Uses the Temporal API when the browser or Node provides it, otherwise `Date`:
 * the result is the same (both go through `Intl`). An invalid `isoDate` throws a `RangeError` in both cases.
 * @param {string} [locale="en"] The locale (BCP 47 tag) of the result (e.g., "fr-FR").
 * @param {string} [isoDate] A date written "YYYY-MM-DD" (e.g., "2026-11-24"). Without it, today's date.
 * @returns {string} The long date (e.g., "Mardi 24 Novembre 2026").
 * @throws {RangeError} When `isoDate` is not a valid date.
 */
export function formatDate(locale: string = "en", isoDate?: string): string {
  const temporal = (globalThis as { Temporal?: TemporalApi }).Temporal;
  const text = temporal ? formatWithTemporal(temporal, locale, isoDate) : formatWithDate(locale, isoDate);
  return capitalize?.(text, locale) ?? text;
}
