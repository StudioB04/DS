/**
 * Will return a short string from large number
 * @example shorten(1550000) => 1.55M
 * @param {number} number
 * @param {number} decimal
 * @returns {string}
 */
export function shorten(number: number, decimal?: number): string {
  const sign = number < 0 ? "-" : "";
  const abs = Math.abs(number);

  if (abs >= 1_000_000_000_000) {
    return sign + Number(abs).toExponential(decimal ?? 2);
  }
  if (abs >= 1_000_000_000) {
    return sign + (Number(abs) / 1e9).toFixed(decimal ?? 2).replace(/\.0$/, "") + "B";
  }
  if (abs >= 1_000_000) {
    return sign + (Number(abs) / 1e6).toFixed(decimal ?? 2).replace(/\.0$/, "") + "M";
  }
  if (abs >= 1_000) {
    return sign + (Number(abs) / 1e3).toFixed(decimal ?? 2).replace(/\.0$/, "") + "K";
  }

  return sign + abs.toString();
}

/**
 * Will return a short string from large filze size
 * @example shorten(1550000) => 1.55Mb
 * @param {number} number
 * @param {number} decimal
 * @returns {string}
 */
export function shortenFileSize(size: number, decimal: number = 2): string {
  if (size < 0) throw new Error("File size cannot be negative");

  const units = ["B", "Kb", "Mb", "Gb", "Tb", "Pb"];
  let index = 0;
  let value = size;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  return value.toFixed(decimal).replace(/\.0+$/, "") + " " + units[index];
}
