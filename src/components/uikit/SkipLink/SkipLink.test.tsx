import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, expectTypeOf, it } from "vitest";
import { axe } from "vitest-axe";

import SkipLink from "./SkipLink";
import type { SkipLinkProps } from "./SkipLink.types";

describe("SkipLink component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <>
        <SkipLink label="Skip to content" anchor="#content" />
        <main id="content">Content</main>
      </>,
    );
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders a link to the anchor with its label", () => {
    render(<SkipLink label="Skip to content" anchor="#content" />);
    const link = screen.getByRole("link", { name: "Skip to content" });

    expect(link).toHaveAttribute("href", "#content");
    expect(link).toHaveClass("ds-skip-link");
  });

  it("is the first element reached with the keyboard", async () => {
    render(
      <>
        <SkipLink label="Skip to content" anchor="#content" />
        <button type="button">Menu</button>
      </>,
    );

    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveFocus();
  });

  it("only accepts anchors starting with #", () => {
    expectTypeOf<"#content">().toExtend<SkipLinkProps["anchor"]>();
    expectTypeOf<"content">().not.toExtend<SkipLinkProps["anchor"]>();
  });

  it("forwards native attributes and merges className", () => {
    render(<SkipLink label="Skip to content" anchor="#content" id="skip" className="custom" data-testid="skip" />);
    const link = screen.getByTestId("skip");

    expect(link).toHaveAttribute("id", "skip");
    expect(link).toHaveClass("ds-skip-link", "custom");
  });
});
