/**
 * Will sort an array by a specific key
 * @param   array The array to sort
 * @param by the key to sort by
 * @param direction ascending or descending
 * @param type type of data in the key
 * @returns
 */
export function sortBy<T>(
  array: T[],
  by: keyof T,
  direction: "asc" | "desc",
  type: "number" | "string" | "date" = "string",
): T[] {
  return [...array].sort((a, b) => {
    const A = a[by];
    const B = b[by];

    if (type === "string") {
      const stringA = String(A ?? "");
      const stringB = String(B ?? "");
      return direction === "asc" ? stringA.localeCompare(stringB) : stringB.localeCompare(stringA);
    }

    if (type === "number") {
      const numberA = Number(A ?? "");
      const numberB = Number(B ?? "");
      return direction === "asc" ? numberA - numberB : numberB - numberA;
    }

    if (type === "date") {
      const dateA = new Date(A as string).getTime();
      const dateB = new Date(B as string).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 1;
  });
}
