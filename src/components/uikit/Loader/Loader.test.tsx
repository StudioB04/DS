import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Loader from "./Loader";

describe("Loader component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Loader />);
    await waitFor(() => {
      expect(container.querySelector("path")).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges className and forwards additional props", () => {
    const { container } = render(<Loader className="custom-loader" data-testid="loader" />);
    const dialog = container.querySelector("dialog");

    expect(dialog).toHaveClass("custom-loader");
    expect(dialog).toHaveAttribute("data-testid", "loader");
  });

  it("should display label", () => {
    const { container } = render(<Loader label="loading..." />);
    const dialog = container.querySelector("dialog");

    expect(dialog).toHaveTextContent("loading...");
  });
});
