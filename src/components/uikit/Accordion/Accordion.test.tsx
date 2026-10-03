import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import Accordion from "./Accordion";

describe("Accordion component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Accordion label="Question">Answer</Accordion>);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders a details element with a summary and default classes", () => {
    const { container } = render(<Accordion label="Question">Answer</Accordion>);
    const details = container.querySelector(".ds-accordion");

    expect(details?.tagName).toBe("DETAILS");
    expect(details).toHaveClass("ds-accordion", "ds-accordion--size-md");
    expect(details?.querySelector(":scope > summary.ds-accordion__summary")).toBeInTheDocument();
    expect(details).not.toHaveAttribute("open");
  });

  it.each(["sm", "md", "lg"] as const)("applies %s size class", (size) => {
    const { container } = render(
      <Accordion label="Question" size={size}>
        Answer
      </Accordion>,
    );
    expect(container.querySelector(".ds-accordion")).toHaveClass(`ds-accordion--size-${size}`);
  });

  it("renders the label and the content", () => {
    render(<Accordion label="Question">Answer</Accordion>);

    expect(screen.getByText("Question")).toBeInTheDocument();
    expect(screen.getByText("Answer")).toHaveClass("ds-accordion__content");
  });

  it("renders markdown in label", () => {
    render(<Accordion label="Is it **bold**?">Answer</Accordion>);
    expect(screen.getByText("bold")).toHaveClass("ds-markdown__strong");
  });

  it("is open when open is true", () => {
    const { container } = render(
      <Accordion label="Question" open>
        Answer
      </Accordion>,
    );
    expect(container.querySelector(".ds-accordion")).toHaveAttribute("open");
  });

  it("forwards the native name attribute for exclusive groups", () => {
    const { container } = render(
      <Accordion label="Question" name="faq">
        Answer
      </Accordion>,
    );
    expect(container.querySelector(".ds-accordion")).toHaveAttribute("name", "faq");
  });

  it("toggles when the summary is clicked and calls onToggle", async () => {
    const onToggle = vi.fn();
    const { container } = render(
      <Accordion label="Question" onToggle={onToggle}>
        Answer
      </Accordion>,
    );
    const details = container.querySelector("details") as HTMLDetailsElement;

    await userEvent.click(screen.getByText("Question"));
    expect(details.open).toBe(true);

    await vi.waitFor(() => expect(onToggle).toHaveBeenCalled());
  });

  it("always renders the chevron as the last element of the summary", () => {
    const { container } = render(<Accordion label="Question">Answer</Accordion>);
    const chevron = container.querySelector(".ds-accordion__chevron");

    expect(chevron).toBeInTheDocument();
    expect(container.querySelector("summary")?.lastElementChild).toBe(chevron);
  });

  it("renders slotStart only when provided", () => {
    const { container, rerender } = render(<Accordion label="Question">Answer</Accordion>);
    expect(container.querySelector(".ds-accordion__slot--start")).not.toBeInTheDocument();

    rerender(
      <Accordion label="Question" slotStart={<span data-testid="custom-slot">★</span>}>
        Answer
      </Accordion>,
    );
    const slot = container.querySelector(".ds-accordion__slot--start");
    expect(slot).toBeInTheDocument();
    expect(slot?.closest("summary")).toBeInTheDocument();
    expect(screen.getByTestId("custom-slot")).toBeInTheDocument();
  });

  it("renders slotEnd only when provided", () => {
    const { container, rerender } = render(<Accordion label="Question">Answer</Accordion>);
    expect(container.querySelector(".ds-accordion__slot--end")).not.toBeInTheDocument();

    rerender(
      <Accordion label="Question" slotEnd={<span data-testid="custom-slot-end">3</span>}>
        Answer
      </Accordion>,
    );
    const slot = container.querySelector(".ds-accordion__slot--end");
    expect(slot).toBeInTheDocument();
    expect(slot?.closest("summary")).toBeInTheDocument();
    expect(screen.getByTestId("custom-slot-end")).toBeInTheDocument();
  });

  it("orders summary children: slotStart, label, slotEnd, chevron", () => {
    const { container } = render(
      <Accordion label="Question" slotStart={<span>Start</span>} slotEnd={<span>End</span>}>
        Answer
      </Accordion>,
    );
    const children = Array.from(container.querySelector("summary")?.children ?? []);
    const expectedOrder = [
      ".ds-accordion__slot--start",
      ".ds-accordion__label",
      ".ds-accordion__slot--end",
      ".ds-accordion__chevron",
    ];

    expect(children).toHaveLength(expectedOrder.length);
    expectedOrder.forEach((selector, index) => expect(children[index].matches(selector)).toBe(true));
  });

  it("forwards native attributes and props to the details element", () => {
    const { container } = render(
      <Accordion label="Question" id="faq-1" data-testid="accordion">
        Answer
      </Accordion>,
    );
    const details = container.querySelector(".ds-accordion");

    expect(details).toHaveAttribute("id", "faq-1");
    expect(details).toHaveAttribute("data-testid", "accordion");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Accordion label="Question" className="custom">
        Answer
      </Accordion>,
    );
    expect(container.querySelector(".ds-accordion")).toHaveClass("ds-accordion", "custom");
  });
});
