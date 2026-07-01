import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Loader from "./Loader";

describe("Loader component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Loader />);
    await waitFor(() => {
      expect(container.querySelector("circle")).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders spinning-dots loader by default", async () => {
    const { container } = render(<Loader />);
    const dialog = container.querySelector("dialog");

    expect(dialog).toHaveClass("ds-loader", "ds-loader--spinning-dots");

    await waitFor(() => {
      expect(container.querySelector("circle")).toBeInTheDocument();
    });
  });

  it("renders ring loader when requested", async () => {
    const { container } = render(<Loader name="ring" />);
    const dialog = container.querySelector("dialog");

    expect(dialog).toHaveClass("ds-loader", "ds-loader--ring");

    await waitFor(() => {
      expect(container.querySelector("path")).toBeInTheDocument();
    });
  });

  it("merges className and forwards additional props", () => {
    const { container } = render(<Loader className="custom-loader" data-testid="loader" />);
    const dialog = container.querySelector("dialog");

    expect(dialog).toHaveClass("custom-loader");
    expect(dialog).toHaveAttribute("data-testid", "loader");
  });
});
