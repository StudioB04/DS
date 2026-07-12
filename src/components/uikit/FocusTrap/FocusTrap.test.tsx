import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import FocusTrap from "./FocusTrap";
import { getInteractiveDomNodes } from "./FocusTrap.utils";

describe("FocusTrap component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(
      <FocusTrap>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </FocusTrap>,
    );

    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("focuses the first interactive element on mount", async () => {
    const { getByRole } = render(
      <FocusTrap>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </FocusTrap>,
    );

    await waitFor(() => {
      expect(getByRole("button", { name: "First action" })).toHaveFocus();
    });
  });

  it("redirects focus from top anchor to the last interactive element", async () => {
    const { container, getByRole } = render(
      <FocusTrap>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </FocusTrap>,
    );

    const anchors = container.querySelectorAll<HTMLButtonElement>(".ds-focus-trap__button");
    const topAnchor = anchors[0];

    topAnchor.focus();

    await waitFor(() => {
      expect(getByRole("button", { name: "Second action" })).toHaveFocus();
    });
  });

  it("redirects focus from bottom anchor to the first interactive element", async () => {
    const { container, getByRole } = render(
      <FocusTrap>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </FocusTrap>,
    );

    const anchors = container.querySelectorAll<HTMLButtonElement>(".ds-focus-trap__button");
    const bottomAnchor = anchors[1];

    bottomAnchor.focus();

    await waitFor(() => {
      expect(getByRole("button", { name: "First action" })).toHaveFocus();
    });
  });

  it("keeps anchor focus when there is no interactive child element", () => {
    const { container } = render(
      <FocusTrap>
        <p>No focusable element</p>
      </FocusTrap>,
    );

    const anchors = container.querySelectorAll<HTMLButtonElement>(".ds-focus-trap__button");
    const topAnchor = anchors[0];
    const bottomAnchor = anchors[1];

    topAnchor.focus();
    expect(topAnchor).toHaveFocus();

    bottomAnchor.focus();
    expect(bottomAnchor).toHaveFocus();
  });

  it("getInteractiveDomNodes returns only focusable elements", () => {
    const host = document.createElement("div");
    host.innerHTML = `
      <button type="button">enabled</button>
      <button type="button" disabled>disabled</button>
      <a href="/docs">link</a>
      <input />
      <textarea></textarea>
      <div tabindex="0">div focusable</div>
      <div tabindex="-1">div not focusable</div>
    `;

    const focusables = getInteractiveDomNodes(host);
    expect(focusables).toHaveLength(5);
    expect(focusables.map((node) => node.tagName)).toEqual(["BUTTON", "A", "INPUT", "TEXTAREA", "DIV"]);
  });
});
