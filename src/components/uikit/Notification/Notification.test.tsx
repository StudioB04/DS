import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Notification from "./Notification";

describe("Notification component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Notification value={3} />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  describe("default rendering", () => {
    it("renders a span with default classes", () => {
      const { container } = render(<Notification value={3} />);
      const notification = container.querySelector(".ds-notification");

      expect(notification?.tagName).toBe("SPAN");
      expect(notification).toHaveClass("ds-notification", "ds-notification--size-md", "ds-notification--variant-red");
    });

    it("renders the numeric value", () => {
      render(<Notification value={3} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("sets title to the raw value", () => {
      const { container } = render(<Notification value={123} max={99} />);
      expect(container.querySelector(".ds-notification")).toHaveAttribute("title", "123");
    });
  });

  describe("size modifier", () => {
    it("applies sm size class", () => {
      const { container } = render(<Notification value={3} size="sm" />);
      expect(container.querySelector(".ds-notification")).toHaveClass("ds-notification--size-sm");
    });

    it("applies md size class by default", () => {
      const { container } = render(<Notification value={3} />);
      expect(container.querySelector(".ds-notification")).toHaveClass("ds-notification--size-md");
    });

    it("applies lg size class", () => {
      const { container } = render(<Notification value={3} size="lg" />);
      expect(container.querySelector(".ds-notification")).toHaveClass("ds-notification--size-lg");
    });

    it.each(["sm", "md", "lg"] as const)("applies %s size class", (size) => {
      const { container } = render(<Notification value={3} size={size} />);
      expect(container.querySelector(".ds-notification")).toHaveClass(`ds-notification--size-${size}`);
    });
  });

  describe("variant modifier", () => {
    it("applies red variant class by default", () => {
      const { container } = render(<Notification value={3} />);
      expect(container.querySelector(".ds-notification")).toHaveClass("ds-notification--variant-red");
    });

    it.each([
      "neutral",
      "inverse",
      "brand",
      "alt",
      "green",
      "red",
      "orange",
      "blue",
      "purple",
      "yellow",
      "pink",
    ] as const)("applies %s variant class", (variant) => {
      const { container } = render(<Notification value={3} variant={variant} />);
      expect(container.querySelector(".ds-notification")).toHaveClass(`ds-notification--variant-${variant}`);
    });
  });

  describe("value display", () => {
    it("renders the exact value when it is lower than max", () => {
      render(<Notification value={50} max={99} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("renders the exact value when it is equal to max", () => {
      render(<Notification value={99} max={99} />);
      expect(screen.getByText("99")).toBeInTheDocument();
    });

    it("renders max+ when value is greater than max", () => {
      render(<Notification value={120} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });
});
