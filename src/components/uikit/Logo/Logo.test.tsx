import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Logo from "./Logo";

describe("Logo component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Logo />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders small variant by default", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    const rect = container.querySelector("rect");

    expect(svg).toHaveClass("ds-logo", "ds-logo--type-small", "ds-logo--variant-brand");
    expect(svg).toHaveAttribute("viewBox", "0 0 1000 1000");
    expect(rect).toHaveAttribute("width", "1000");
    expect(rect).toHaveAttribute("height", "1000");
  });

  it("renders full type with expected dimensions and classes", () => {
    const { container } = render(<Logo type="full" variant="inverse" />);
    const svg = container.querySelector("svg");
    const rect = container.querySelector("rect");

    expect(svg).toHaveClass("ds-logo--type-full", "ds-logo--variant-inverse");
    expect(svg).toHaveAttribute("viewBox", "0 0 1000 250");
    expect(rect).toHaveAttribute("height", "250");
  });

  it("merges className and forwards additional props", () => {
    const { container } = render(<Logo className="custom-logo" data-testid="logo" role="img" />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveClass("ds-logo", "custom-logo");
    expect(svg).toHaveAttribute("data-testid", "logo");
    expect(svg).toHaveAttribute("role", "img");
  });
});
