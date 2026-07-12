import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Size } from "$/types";
import Button from "./Button";

describe("Button component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Button label="Click me" size={Size.md} />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders a button by default with expected classes", () => {
    render(<Button label="Click me" size={Size.md} />);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toHaveClass(
      "ds-button",
      "ds-button--size-md",
      "ds-button--shape-square",
      "ds-button--variant-primary",
    );
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("title", "Click me");
  });

  it("renders an anchor when href is provided", () => {
    render(<Button label="Read docs" size={Size.md} href="/docs" />);

    const link = screen.getByRole("link", { name: "Read docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).not.toHaveAttribute("type");
  });

  it("adds external link attributes when external is true", () => {
    render(<Button label="External" size={Size.md} href="https://example.com" external />);

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies loading state with loader and disabled interaction", () => {
    const { container } = render(<Button label="Loading" size={Size.md} loading />);

    const button = screen.getByRole("button", { name: "Loading" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("inert");
    expect(button).toHaveClass("ds-button--loading");
    expect(container.querySelector(".ds-button__loader")).toBeInTheDocument();
  });

  it("applies disabled state when disabled is true", () => {
    render(<Button label="Disabled" size={Size.md} disabled />);

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("ds-button--disabled");
  });

  it("renders iconOnly mode", () => {
    const { container } = render(<Button label="Icon" size={Size.md} iconOnly="smile" />);

    expect(screen.getByRole("button", { name: "Icon" })).toHaveClass("ds-button--icon-only");
    expect(container.querySelector(".ds-button__icon--only")).toBeInTheDocument();
    expect(container.querySelector(".ds-markdown")).not.toBeInTheDocument();
  });

  it("renders external-link icon when href is external and iconEnd is not provided", () => {
    const { container } = render(<Button label="Docs" size={Size.md} href="https://example.com" external />);

    expect(container.querySelector(".ds-button__icon--external")).toBeInTheDocument();
  });

  it("renders slot content on both sides", () => {
    render(<Button label="Slot" size={Size.md} slotStart={<span>Left</span>} slotEnd={<span>Right</span>} />);

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("uses explicit title when provided", () => {
    render(<Button label="Click me" size={Size.md} title="Custom title" />);

    expect(screen.getByRole("button", { name: "Click me" })).toHaveAttribute("title", "Custom title");
  });

  it("renders markdown in label", () => {
    render(<Button label="Click **me**" size={Size.md} />);

    expect(screen.getByText("me")).toHaveClass("ds-markdown__strong");
  });
});
