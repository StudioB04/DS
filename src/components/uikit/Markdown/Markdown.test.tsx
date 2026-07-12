import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Markdown from "./Markdown";

describe("Markdown component", () => {
  it("renders markdown content with the default overrides", async () => {
    const { container } = render(
      <Markdown>
        {`# Title

Paragraph with *emphasis* and **strong text** plus \`code\`.

- first item
- second item

1. first step
2. second step

![image](https://placehold.co/100)
`}
      </Markdown>,
    );

    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("ds-markdown__title", "ds-markdown__title--h1");
    expect(container.querySelector("p")).toHaveClass("ds-markdown__p");
    expect(container.querySelector("em")).toHaveClass("ds-markdown__em");
    expect(container.querySelector("strong")).toHaveClass("ds-markdown__strong");
    expect(container.querySelector("code")).toHaveClass("ds-markdown__code");
    expect(container.querySelector("ul")).toHaveClass("ds-markdown__ul");
    expect(container.querySelector("ol")).toHaveClass("ds-markdown__ol");
    expect(container.querySelectorAll("li")).toHaveLength(4);
    expect(container.querySelector("hr")).toBeNull();
    expect(screen.getByAltText("image")).toHaveClass("ds-markdown__img");
  });

  it("renders external and internal links with the expected attributes", () => {
    render(<Markdown allowTags={["a"]}>[internal](/docs) [external](!!https://example.com)</Markdown>);

    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/docs");
    expect(links[0]).not.toHaveAttribute("target");
    expect(links[1]).toHaveAttribute("href", "https://example.com");
    expect(links[1]).toHaveAttribute("target", "_blank");
    expect(links[1]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("omits links when anchors are not allowed", () => {
    render(<Markdown allowTags={["p"]}>[hidden](https://example.com)</Markdown>);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.body.textContent).toBe("");
  });

  it("ignores disallowed headings", () => {
    render(<Markdown allowTags={["a"]}># Hidden heading</Markdown>);

    expect(screen.getByText("Hidden heading")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders custom html when allowHtml is enabled", () => {
    render(<Markdown allowHtml>{"<strong>custom html</strong>"}</Markdown>);

    expect(screen.getByText("custom html")).toHaveClass("ds-markdown__strong");
  });
});
