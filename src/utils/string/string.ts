/**
 * Converts a string into a clean, URL-friendly slug by removing accents,
 * converting to lowercase, and replacing spaces and special characters with hyphens.
 * @param {string} string The input string (e.g., "lorem Ipsum").
 * @returns {string} The URL slug (e.g., "lorem-ipsum").
 */
export function slugify(string = "") {
  // 1. Handle camelCase words (e.g., LoremIpsum -> Lorem-Ipsum)
  const withHyphens = string.replace(/([a-z])([A-Z])/g, "$1-$2");

  // 2. Normalize: Remove diacritics (accents) and convert to lowercase.
  const normalizedStr = withHyphens
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 3. Clean Up: Replace non-slug characters, spaces, and underscores with hyphens.
  return normalizedStr
    .replace(/[^\w\s-]/g, "-") // Replace symbols/punctuation with a hyphen
    .replace(/[-\s_]+/g, "-") // Replace any run of hyphens, spaces, or underscores with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
}

/**
 * Converts a string to camelCase
 * @param {string} string The input string (e.g., "lorem Ipsum").
 * @returns {string} The camelCased string (e.g., "loremIpsum").
 */
export function camelCase(string: string = ""): string {
  return string
    .replace(/[-_]+/g, " ") // Replace hyphens/underscores with spaces
    .replace(/[^\w\s]/g, "") // Remove non-word characters
    .replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase()) // Capitalize letters after spaces
    .replace(/^\w/, (c: string) => c.toLowerCase()); // Lowercase the first character
}

/**
 * Converts a string to snake_case
 * @param {string} string The input string (e.g., "lorem Ipsum").
 * @returns {string} The snake_cased string (e.g., "lorem_ipsum").
 */
export function snakeCase(string: string = ""): string {
  return string
    .replace(/([a-z])([A-Z])/g, "$1_$2") // Handle camelCase words (e.g., LoremIpsum -> lorem_Ipsum)
    .replace(/[-\s]+/g, "_") // Replace hyphens and spaces with underscores
    .replace(/[^\w_]/g, "") // Remove remaining non-word characters (except underscores)
    .toLowerCase(); // Convert to lowercase
}

/**
 * Converts a string to kebab-case
 * @param {string} string The input string (e.g., "lorem Ipsum").
 * @returns {string} The kebab-cased string (e.g., "lorem-ipsum").
 */
export function kebabCase(string: string = ""): string {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert a hyphen between camelCase words
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/[^\w-]/g, "") // Remove any remaining non-word characters (except hyphens)
    .replace(/-+/g, "-") // Clean up any accidental double hyphens
    .toLowerCase(); // Convert to lowercase
}

/**
 * Converts a string to PascalCase
 * @param {string} string The input string (e.g., "lorem Ipsum").
 * @returns {string} The PascalCased string (e.g., "LoremIpsum").
 */
export function pascalCase(string: string = ""): string {
  return string
    .replace(/[-_]+/g, " ") // Replace hyphens/underscores with spaces
    .replace(/[^\w\s]/g, "") // Remove non-word characters
    .replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase()) // Capitalize letters after spaces
    .replace(/^\w/, (c: string) => c.toUpperCase()); // Uppercase the first character
}

/**
 * Get first letters of each word in a string
 * @param {string} string The input string (e.g., "lorem Ipsum").
 * @returns {string} The initials string (e.g., "LI").
 */
export function getInitials(string: string = "", length: number = 2): string {
  if (!string) {
    return "";
  }

  return string
    .split(" ")
    .slice(0, length)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Get return a humanized version of a string by handling camelCase, PascalCase, underscores, and hyphens.
 * @param {string} string The input string (e.g., "loremIpsum" or "lorem-ipsum").
 * @returns {string} The humanized string (e.g., "Lorem Ipsum").
 */
export function humanize(string: string = ""): string {
  if (!string) return "";

  return string
    .replace(/(\p{Lu})/gu, " $1") // 1. camelCase/PascalCase :
    .replace(/[_-]+/g, " ") // 2. underscores and hyphens :
    .replace(/\s+/g, " ") // 3. Clean up multiple spaces (e.g., from _A)
    .toLowerCase() // 4. Convert to lowercase and trim spaces
    .trim();
}
