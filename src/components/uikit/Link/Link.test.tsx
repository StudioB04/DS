import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Link from "./Link";

describe("Link component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Link label="Read docs" href="/docs" />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders an anchor when href is provided", () => {
    render(<Link label="Read docs" href="/docs" />);

    const link = screen.getByRole("link", { name: "Read docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).not.toHaveAttribute("type");
  });

  it("renders a button when href is not provided", () => {
    render(<Link label="Action" />);

    const button = screen.getByRole("button", { name: "Action" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("adds external link attributes and icon", () => {
    const { container } = render(<Link label="External" href="https://example.com" external />);

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector(".ds-link__icon--external")).toBeInTheDocument();
  });

  it("renders start and end icons when provided", () => {
    const { container } = render(<Link label="Iconic" iconStart="smile" iconEnd="alarm-clock-check" />);

    expect(container.querySelector(".ds-link__icon--start")).toBeInTheDocument();
    expect(container.querySelector(".ds-link__icon--end")).toBeInTheDocument();
  });

  it("applies disabled state class and disabled attribute", () => {
    render(<Link label="Disabled" disabled />);

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toHaveClass("ds-link--disabled");
    expect(button).toHaveAttribute("disabled");
  });

  it("renders markdown in label", () => {
    render(<Link label="Click **me**" />);
    expect(screen.getByText("me")).toHaveClass("ds-markdown__strong");
  });
});
