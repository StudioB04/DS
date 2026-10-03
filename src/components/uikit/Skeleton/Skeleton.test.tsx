import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Skeleton from "./Skeleton";

describe("Skeleton component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Skeleton height="48px" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders a hidden div with default classes", () => {
    const { container } = render(<Skeleton height="48px" />);
    const skeleton = container.querySelector(".ds-skeleton");

    expect(skeleton?.tagName).toBe("DIV");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("ds-skeleton", "ds-skeleton--type-block");
  });

  it.each(["block", "round", "text"] as const)("applies %s type class", (type) => {
    const { container } = render(<Skeleton height="48px" type={type} />);
    expect(container.querySelector(".ds-skeleton")).toHaveClass(`ds-skeleton--type-${type}`);
  });

  it.each(["48px", "3rem", "2.5rem"] as const)("sets the %s height as a CSS variable", (height) => {
    const { container } = render(<Skeleton height={height} />);
    expect(
      (container.querySelector(".ds-skeleton") as HTMLElement).style.getPropertyValue("--ds-skeleton-height"),
    ).toBe(height);
  });

  it("does not set the height variable when height is omitted", () => {
    const { container } = render(<Skeleton />);
    expect(
      (container.querySelector(".ds-skeleton") as HTMLElement).style.getPropertyValue("--ds-skeleton-height"),
    ).toBe("");
  });

  it("keeps custom styles alongside the height variable", () => {
    const { container } = render(<Skeleton height="48px" style={{ marginTop: "8px" }} />);
    const skeleton = container.querySelector(".ds-skeleton") as HTMLElement;

    expect(skeleton.style.marginTop).toBe("8px");
    expect(skeleton.style.getPropertyValue("--ds-skeleton-height")).toBe("48px");
  });

  it("forwards native attributes and merges className", () => {
    const { container } = render(<Skeleton height="48px" id="skeleton" className="custom" data-testid="skeleton" />);
    const skeleton = container.querySelector(".ds-skeleton");

    expect(skeleton).toHaveAttribute("id", "skeleton");
    expect(skeleton).toHaveAttribute("data-testid", "skeleton");
    expect(skeleton).toHaveClass("ds-skeleton", "custom");
  });
});
