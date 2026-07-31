import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Badge from "./Badge";

describe("Badge component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Badge label="Status" type="light" shape="pill" />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  describe("default rendering", () => {
    it("renders a span with default classes", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      const badge = container.querySelector(".ds-badge");

      expect(badge?.tagName).toBe("SPAN");
      expect(badge).toHaveClass(
        "ds-badge",
        "ds-badge--size-md",
        "ds-badge--type-light",
        "ds-badge--shape-pill",
        "ds-badge--variant-neutral",
      );
    });

    it("renders the label", () => {
      render(<Badge label="Status" type="light" shape="pill" />);
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders the label via the Markdown component", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge__label")).toBeInTheDocument();
    });

    it("renders markdown in label", () => {
      render(<Badge label="**Bold** text" type="light" shape="pill" />);
      expect(screen.getByText("Bold")).toHaveClass("ds-markdown__strong");
    });
  });

  describe("size modifier", () => {
    it("applies sm size class", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" size="sm" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--size-sm");
    });

    it("applies md size class by default", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--size-md");
    });

    it("applies lg size class", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" size="lg" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--size-lg");
    });
  });

  describe("type modifier", () => {
    it("applies light type class", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--type-light");
    });

    it("applies plain type class", () => {
      const { container } = render(<Badge label="Status" type="plain" shape="pill" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--type-plain");
    });
  });

  describe("shape modifier", () => {
    it("applies pill shape class", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--shape-pill");
    });

    it("applies square shape class", () => {
      const { container } = render(<Badge label="Status" type="light" shape="square" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--shape-square");
    });
  });

  describe("variant modifier", () => {
    it("applies neutral variant class by default", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge")).toHaveClass("ds-badge--variant-neutral");
    });

    it.each([
      "primary",
      "secondary",
      "success",
      "error",
      "warning",
      "info",
      "inverse",
      "purple",
      "yellow",
      "pink",
    ] as const)("applies %s variant class", (variant) => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" variant={variant} />);
      expect(container.querySelector(".ds-badge")).toHaveClass(`ds-badge--variant-${variant}`);
    });
  });

  describe("icon support", () => {
    it("renders iconStart when provided", () => {
      const { container } = render(<Badge label="Tagged" type="light" shape="pill" iconStart="tag" />);
      expect(container.querySelector(".ds-badge__icon--start")).toBeInTheDocument();
    });

    it("does not render iconStart when omitted", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge__icon--start")).not.toBeInTheDocument();
    });

    it("renders iconEnd when provided", () => {
      const { container } = render(<Badge label="Archived" type="light" shape="pill" iconEnd="archive" />);
      expect(container.querySelector(".ds-badge__icon--end")).toBeInTheDocument();
    });

    it("does not render iconEnd when omitted", () => {
      const { container } = render(<Badge label="Status" type="light" shape="pill" />);
      expect(container.querySelector(".ds-badge__icon--end")).not.toBeInTheDocument();
    });

    it("renders both iconStart and iconEnd simultaneously", () => {
      const { container } = render(<Badge label="Tagged" type="light" shape="pill" iconStart="tag" iconEnd="x" />);
      expect(container.querySelector(".ds-badge__icon--start")).toBeInTheDocument();
      expect(container.querySelector(".ds-badge__icon--end")).toBeInTheDocument();
    });

    it("renders iconOnly and hides label", () => {
      const { container } = render(<Badge label="Check" type="plain" shape="pill" iconOnly="circle-check" />);
      expect(container.querySelector(".ds-badge__icon--only")).toBeInTheDocument();
      expect(container.querySelector(".ds-badge__label")).not.toBeInTheDocument();
    });

    it("does not render iconStart or iconEnd in icon-only mode", () => {
      const { container } = render(<Badge label="Check" type="plain" shape="pill" iconOnly="circle-check" />);
      expect(container.querySelector(".ds-badge__icon--start")).not.toBeInTheDocument();
      expect(container.querySelector(".ds-badge__icon--end")).not.toBeInTheDocument();
    });
  });
});
