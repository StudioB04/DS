import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";

import Icon from "./Icon";

const MOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>';

describe("Icon component", () => {
  describe("accessibility", () => {
    it("should have no violations in Lucide sprite mode", async () => {
      const { container } = render(<Icon src="smile" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("should have no violations in custom URL mode", async () => {
      const { container } = render(<Icon src="lucide-static/icons/beer.svg" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("should have no violations in inline SVG string mode", async () => {
      const { container } = render(<Icon src={MOCK_SVG} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("Lucide sprite mode", () => {
    it("renders a <use> pointing to the Lucide sprite for a known icon name", () => {
      const { container } = render(<Icon src="smile" />);
      expect(container.querySelector("use")).toHaveAttribute("href", "/lucide-static/sprite.svg#smile");
    });

    it("defaults to size 24", () => {
      const { container } = render(<Icon src="smile" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });

    it("applies the given size as width and height", () => {
      const { container } = render(<Icon src="smile" size={48} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "48");
      expect(svg).toHaveAttribute("height", "48");
    });

    it("applies ds-icon and modifier classes", () => {
      const { container } = render(<Icon src="smile" size={32} />);
      expect(container.querySelector("svg")).toHaveClass("ds-icon", "ds-icon--smile", "ds-icon--size-32");
    });

    it("is aria-hidden by default", () => {
      const { container } = render(<Icon src="smile" />);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("custom URL mode", () => {
    it("renders a <use> with src as href for an unknown string", () => {
      const { container } = render(<Icon src="/icons/sprite.svg#logo" />);
      expect(container.querySelector("use")).toHaveAttribute("href", "/icons/sprite.svg#logo");
    });

    it("applies ds-icon class", () => {
      const { container } = render(<Icon src="/icons/sprite.svg#logo" />);
      expect(container.querySelector("svg")).toHaveClass("ds-icon");
    });
  });

  describe("inline SVG string mode", () => {
    it("renders inner SVG content via dangerouslySetInnerHTML", () => {
      const { container } = render(<Icon src={MOCK_SVG} />);
      expect(container.querySelector("g")).toBeInTheDocument();
    });

    it("returns null for a malformed SVG string with no closing tag", () => {
      const { container } = render(<Icon src="<svg>broken" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("fat prop", () => {
    it("adds ds-icon--fat class when fat is true", () => {
      const { container } = render(<Icon src="smile" fat />);
      expect(container.querySelector("svg")).toHaveClass("ds-icon--fat");
    });

    it("does not add ds-icon--fat class when fat is omitted", () => {
      const { container } = render(<Icon src="smile" />);
      expect(container.querySelector("svg")).not.toHaveClass("ds-icon--fat");
    });
  });

  describe("className prop", () => {
    it("merges custom className with base classes", () => {
      const { container } = render(<Icon src="smile" className="my-icon" />);
      expect(container.querySelector("svg")).toHaveClass("ds-icon", "my-icon");
    });
  });

  describe("SVGProps forwarding", () => {
    it("spreads additional props onto the svg element", () => {
      const { container } = render(<Icon src="smile" aria-label="Smile icon" role="img" aria-hidden={false} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label", "Smile icon");
      expect(svg).toHaveAttribute("role", "img");
    });
  });
});
