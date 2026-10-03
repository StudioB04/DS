import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Divider from "./Divider";

describe("Divider component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Divider />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("should have no accessibility violations when vertical", async () => {
    const { container } = render(
      <div style={{ display: "flex" }}>
        <span>Left</span>
        <Divider vertical />
        <span>Right</span>
      </div>,
    );
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders a decorative div with default classes", () => {
    const { container } = render(<Divider />);
    const divider = container.querySelector(".ds-divider");

    expect(divider?.tagName).toBe("DIV");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveClass("ds-divider", "ds-divider--size-md", "ds-divider--variant-primary");
    expect(divider).not.toHaveClass("ds-divider--vertical");
  });

  it.each(["0", 0, "sm", "md", "lg"] as const)("applies %s size class", (size) => {
    const { container } = render(<Divider size={size} />);
    expect(container.querySelector(".ds-divider")).toHaveClass(`ds-divider--size-${size}`);
  });

  it.each(["primary", "secondary", "tertiary"] as const)("applies %s variant class", (variant) => {
    const { container } = render(<Divider variant={variant} />);
    expect(container.querySelector(".ds-divider")).toHaveClass(`ds-divider--variant-${variant}`);
  });

  it("applies the vertical modifier when vertical is true", () => {
    const { container } = render(<Divider vertical />);
    expect(container.querySelector(".ds-divider")).toHaveClass("ds-divider--vertical");
  });

  it("forwards native attributes and merges className", () => {
    const { container } = render(<Divider id="divider" className="custom" data-testid="divider" />);
    const divider = container.querySelector(".ds-divider");

    expect(divider).toHaveAttribute("id", "divider");
    expect(divider).toHaveAttribute("data-testid", "divider");
    expect(divider).toHaveClass("ds-divider", "custom");
  });
});
