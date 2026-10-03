import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import Alert from "./Alert";

describe("Alert component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Alert title="Saved">Your changes have been saved.</Alert>);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("should have no accessibility violations when persistant", async () => {
    const { container } = render(
      <Alert title="Saved" persistant>
        Your changes have been saved.
      </Alert>,
    );
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders an alert with default classes", () => {
    render(<Alert title="Saved" />);
    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("ds-alert", "ds-alert--variant-neutral");
    expect(alert).not.toHaveClass("ds-alert--persistant");
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
    render(<Alert title="Saved" variant={variant} />);
    expect(screen.getByRole("alert")).toHaveClass(`ds-alert--variant-${variant}`);
  });

  it("renders the title with markdown", () => {
    render(<Alert title="Changes **saved**" />);

    expect(screen.getByText("saved")).toHaveClass("ds-markdown__strong");
    expect(screen.getByRole("alert").querySelector(".ds-alert__title")).toBeInTheDocument();
  });

  it("renders the content only when children are provided", () => {
    const { rerender } = render(<Alert title="Saved" />);
    expect(screen.getByRole("alert").querySelector(".ds-alert__content")).not.toBeInTheDocument();

    rerender(
      <Alert title="Saved">
        <p>Your changes have been saved.</p>
      </Alert>,
    );
    expect(screen.getByText("Your changes have been saved.").closest(".ds-alert__content")).toBeInTheDocument();
  });

  it("renders titleSlotStart before the title", () => {
    render(<Alert title="Saved" titleSlotStart={<span data-testid="slot">★</span>} />);
    const slot = screen.getByTestId("slot").closest(".ds-alert__slot--title-start");

    expect(slot).toBeInTheDocument();
    expect(slot?.nextElementSibling).toHaveClass("ds-alert__title");
  });

  it("renders titleSlotEnd right after the title", () => {
    render(<Alert title="Saved" titleSlotEnd={<span data-testid="slot-end">3</span>} />);
    const slot = screen.getByTestId("slot-end").closest(".ds-alert__slot--title-end");

    expect(slot).toBeInTheDocument();
    expect(slot?.previousElementSibling).toHaveClass("ds-alert__title");
  });

  it("orders the header: titleSlotStart, title, titleSlotEnd, close button", () => {
    render(<Alert title="Saved" titleSlotStart={<span>Start</span>} titleSlotEnd={<span>End</span>} />);
    const children = Array.from(screen.getByRole("alert").querySelector(".ds-alert__header")?.children ?? []);
    const expectedOrder = [
      ".ds-alert__slot--title-start",
      ".ds-alert__title",
      ".ds-alert__slot--title-end",
      ".ds-alert__close",
    ];

    expect(children).toHaveLength(expectedOrder.length);
    expectedOrder.forEach((selector, index) => expect(children[index].matches(selector)).toBe(true));
  });

  it("closes when the close button is clicked and calls onClose", async () => {
    const onClose = vi.fn();
    render(<Alert title="Saved" onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("forwards event handlers such as onAnimationEnd to the root element", () => {
    const onAnimationEnd = vi.fn();
    render(<Alert title="Saved" onAnimationEnd={onAnimationEnd} />);

    fireEvent.animationEnd(screen.getByRole("alert"));
    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it("uses closeLabel as the accessible name of the close button", () => {
    render(<Alert title="Saved" closeLabel="Fermer" />);
    expect(screen.getByRole("button", { name: "Fermer" })).toBeInTheDocument();
  });

  it("hides the close button when persistant", () => {
    render(<Alert title="Saved" persistant />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("ds-alert--persistant");
  });

  it("forwards native attributes and merges className", () => {
    render(<Alert title="Saved" id="alert" className="custom" data-testid="alert" />);
    const alert = screen.getByTestId("alert");

    expect(alert).toHaveAttribute("id", "alert");
    expect(alert).toHaveClass("ds-alert", "custom");
  });
});
