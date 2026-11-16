import { describe, it, expect } from "vitest";
import { sortBy } from "./array";

const mockUsers = [
  { id: 3, name: "Charlie", birthDate: "1995-05-12" },
  { id: 1, name: "Alice", birthDate: "1990-01-01" },
  { id: 2, name: "Bob", birthDate: "2000-11-23" },
];

describe("sortBy", () => {
  // --- STRING TESTS ---
  describe("Type: string (or default value)", () => {
    it("should sort by alphabetical order (ascending)", () => {
      const result = sortBy(mockUsers, "name", "asc");
      expect(result[0].name).toBe("Alice");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Charlie");
    });

    it("should sort by alphabetical order (descending)", () => {
      const result = sortBy(mockUsers, "name", "desc", "string");
      expect(result[0].name).toBe("Charlie");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Alice");
    });
  });

  // --- NUMBERS TESTS ---
  describe("Type: number", () => {
    it("should sort numbers in ascending order", () => {
      const result = sortBy(mockUsers, "id", "asc", "number");
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });

    it("should sort numbers in descending order", () => {
      const result = sortBy(mockUsers, "id", "desc", "number");
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(1);
    });
  });

  // --- DATES TESTS ---
  describe("Type: date", () => {
    it("should sort dates from oldest to newest (ascending)", () => {
      const result = sortBy(mockUsers, "birthDate", "asc", "date");
      expect(result[0].birthDate).toBe("1990-01-01");
      expect(result[1].birthDate).toBe("1995-05-12");
      expect(result[2].birthDate).toBe("2000-11-23");
    });

    it("should sort dates from newest to oldest (descending)", () => {
      const result = sortBy(mockUsers, "birthDate", "desc", "date");
      expect(result[0].birthDate).toBe("2000-11-23");
      expect(result[1].birthDate).toBe("1995-05-12");
      expect(result[2].birthDate).toBe("1990-01-01");
    });
  });

  // --- MISSING VALUES TESTS ---
  describe("Missing values", () => {
    const items: { name?: string | null; value?: number | null }[] = [
      { name: "b", value: 5 },
      { name: null, value: null },
      { name: "a", value: -2 },
      { name: undefined, value: undefined },
    ];

    it("should treat null and undefined strings as empty strings (ascending)", () => {
      const result = sortBy(items, "name", "asc");
      expect(result.map((item) => item.name)).toEqual([null, undefined, "a", "b"]);
    });

    it("should treat null and undefined strings as empty strings (descending)", () => {
      const result = sortBy(items, "name", "desc");
      expect(result.map((item) => item.name)).toEqual(["b", "a", null, undefined]);
    });

    it("should treat null and undefined numbers as 0 (ascending)", () => {
      const result = sortBy(items, "value", "asc", "number");
      expect(result.map((item) => item.value)).toEqual([-2, null, undefined, 5]);
    });

    it("should treat null and undefined numbers as 0 (descending)", () => {
      const result = sortBy(items, "value", "desc", "number");
      expect(result.map((item) => item.value)).toEqual([5, null, undefined, -2]);
    });
  });

  // --- UNKNOWN TYPE TEST ---
  describe("Unknown type", () => {
    it("should return every item without throwing", () => {
      const result = sortBy(mockUsers, "name", "asc", "unknown" as never);
      expect(result).toHaveLength(mockUsers.length);
      expect(result).toEqual(expect.arrayContaining(mockUsers));
    });
  });

  // --- IMMUTABILITY SAFETY TEST ---
  describe("Immutability", () => {
    it("should not mutate the original array", () => {
      const originalCopy = [...mockUsers];
      sortBy(mockUsers, "name", "asc");
      expect(mockUsers).toEqual(originalCopy);
    });
  });
});
