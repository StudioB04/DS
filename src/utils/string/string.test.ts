import { describe, expect, it } from "vitest";

import { slugify, camelCase, snakeCase, kebabCase, pascalCase, getInitials, humanize } from "./string";

describe("string util", () => {
  it("should return white for dark colors", () => {});

  it("should slugify", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("This-is-a-test")).toBe("this-is-a-test");
    expect(slugify("Another_Test")).toBe("another-test");
    expect(slugify("OneMoreTest")).toBe("one-more-test");
  });

  it("should camelCase", () => {
    expect(camelCase("Hello World")).toBe("helloWorld");
    expect(camelCase("This-is-a-test")).toBe("thisIsATest");
    expect(camelCase("Another_Test")).toBe("anotherTest");
    expect(camelCase("OneMoreTest")).toBe("oneMoreTest");
  });

  it("should snakeCase", () => {
    expect(snakeCase("Hello World")).toBe("hello_world");
    expect(snakeCase("This-is-a-test")).toBe("this_is_a_test");
    expect(snakeCase("Another_Test")).toBe("another_test");
    expect(snakeCase("OneMoreTest")).toBe("one_more_test");
  });

  it("should kebabCase", () => {
    expect(kebabCase("Hello World")).toBe("hello-world");
    expect(kebabCase("This-is-a-test")).toBe("this-is-a-test");
    expect(kebabCase("Another_Test")).toBe("another-test");
    expect(kebabCase("OneMoreTest")).toBe("one-more-test");
  });

  it("should pascalCase", () => {
    expect(pascalCase("Hello World")).toBe("HelloWorld");
    expect(pascalCase("This-is-a-test")).toBe("ThisIsATest");
    expect(pascalCase("Another_Test")).toBe("AnotherTest");
    expect(pascalCase("OneMoreTest")).toBe("OneMoreTest");
  });

  it("should getInitials", () => {
    expect(getInitials("Hello World")).toBe("HW");
    expect(getInitials("This is a test")).toBe("TI");
    expect(getInitials("Another Test")).toBe("AT");
    expect(getInitials("One More Test")).toBe("OM");
    expect(getInitials("")).toBe("");
  });

  it("should humanize", () => {
    expect(humanize("helloWorld")).toBe("hello world");
    expect(humanize("this-is-a-test")).toBe("this is a test");
    expect(humanize("Another_Test")).toBe("another test");
    expect(humanize("OneMoreTest")).toBe("one more test");
    expect(humanize("")).toBe("");
  });
});
