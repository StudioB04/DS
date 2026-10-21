import { act, createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import Dialog from "./Dialog";
import type { DialogHandle, DialogProps } from "./Dialog.types";

const togglePopover = vi.fn(function (this: HTMLElement, force?: boolean) {
  const isShown = this.hasAttribute("data-popover-open");
  const next = force ?? !isShown;
  if (next === isShown) return next;

  const state = { newState: next ? "open" : "closed", oldState: next ? "closed" : "open" };
  const dispatch = (type: string) => this.dispatchEvent(Object.assign(new Event(type), state));

  dispatch("beforetoggle");
  if (next) {
    this.setAttribute("data-popover-open", "");
  } else {
    this.removeAttribute("data-popover-open");
    if (this.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
  }
  dispatch("toggle");

  return next;
});

const getDialog = () => document.querySelector("dialog") as HTMLDialogElement;
const isOpen = () => getDialog().hasAttribute("data-popover-open");

const renderOpenable = (props: Partial<DialogProps> = {}) => {
  const ref = createRef<DialogHandle>();
  render(
    <Dialog ref={ref} title="Dialog title" {...props}>
      <p>lorem Ipsum</p>
    </Dialog>,
  );
  return ref;
};

describe("Dialog component", () => {
  beforeEach(() => {
    HTMLElement.prototype.togglePopover = togglePopover;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <Dialog title="Dialog title" description="Dialog description" footer={<button type="button">Confirm</button>}>
        <p>lorem Ipsum</p>
      </Dialog>,
    );
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  describe("structure", () => {
    it("renders the title, description, content and footer", () => {
      render(
        <Dialog title="Dialog title" description="Dialog description" footer={<button type="button">Confirm</button>}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      const dialog = getDialog();

      expect(screen.getByRole("heading", { level: 2, hidden: true })).toHaveTextContent("Dialog title");
      expect(dialog).toHaveAttribute("aria-labelledby", screen.getByText("Dialog title").id);
      expect(dialog).toHaveAttribute("aria-describedby", dialog.querySelector(".ds-dialog__header__description")?.id);
      expect(dialog.querySelector(".ds-dialog__body")).toHaveTextContent("lorem Ipsum");
      expect(dialog.querySelector(".ds-dialog__footer")).toHaveTextContent("Confirm");
    });

    it("renders neither footer, header slot nor description when they are missing", () => {
      render(
        <Dialog title="Dialog title" aria-label="Custom name">
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      const dialog = getDialog();

      expect(dialog.querySelector(".ds-dialog__footer")).toBeNull();
      expect(dialog.querySelector(".ds-dialog__header__slot")).toBeNull();
      expect(dialog.querySelector(".ds-dialog__header__description")).toBeNull();
      expect(dialog).toHaveAttribute("aria-labelledby", screen.getByText("Dialog title").id);
      expect(dialog).not.toHaveAttribute("aria-describedby");
      expect(dialog).toHaveAttribute("aria-label", "Custom name");
    });

    it("renders the header slot", () => {
      render(
        <Dialog title="Dialog title" headerSlot={<span>Slot content</span>}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      expect(getDialog().querySelector(".ds-dialog__header__slot")).toHaveTextContent("Slot content");
    });

    it("renders default classes", () => {
      render(
        <Dialog title="Dialog title">
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      expect(getDialog()).toHaveClass("ds-dialog", "ds-dialog--size-md", "ds-dialog--position-center");
      expect(getDialog()).not.toHaveClass("ds-dialog--persistent");
    });

    it("forwards native attributes and className", () => {
      render(
        <Dialog title="Dialog title" id="my-dialog" className="custom">
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      expect(getDialog()).toHaveAttribute("id", "my-dialog");
      expect(getDialog()).toHaveClass("ds-dialog", "custom");
    });

    it.each(["sm", "md", "lg", "full"] as const)("applies the %s size class", (size) => {
      render(
        <Dialog title="Dialog title" size={size}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      expect(getDialog()).toHaveClass(`ds-dialog--size-${size}`);
    });

    it.each(["center", "start", "end", "bottom"] as const)("applies the %s position class", (position) => {
      render(
        <Dialog title="Dialog title" position={position}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      expect(getDialog()).toHaveClass(`ds-dialog--position-${position}`);
    });
  });

  describe("popover", () => {
    it("is an auto popover, announced as modal", () => {
      renderOpenable();

      expect(getDialog()).toHaveAttribute("popover", "auto");
      expect(getDialog()).toHaveAttribute("aria-modal", "true");
    });

    it("is a manual popover when persistent", () => {
      renderOpenable({ persistent: true });

      expect(getDialog()).toHaveAttribute("popover", "manual");
      expect(getDialog()).toHaveClass("ds-dialog--persistent");
    });

    it("uses the current persistent value after it changes", () => {
      const { rerender } = render(
        <Dialog title="Dialog title">
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      rerender(
        <Dialog title="Dialog title" persistent>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      expect(getDialog()).toHaveAttribute("popover", "manual");
    });

    it("cannot be overridden by the native attributes", () => {
      render(
        <Dialog title="Dialog title" {...({ popover: "manual", open: true } as object)}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      expect(getDialog()).toHaveAttribute("popover", "manual");
    });

    it("renders no close button when persistent", () => {
      renderOpenable({ persistent: true });

      expect(screen.queryByRole("button", { name: "Close", hidden: true })).not.toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("is closed by default", () => {
      renderOpenable();

      expect(isOpen()).toBe(false);
      expect(togglePopover).not.toHaveBeenCalled();
    });

    it("opens through the ref and calls onOpen once", () => {
      const onOpen = vi.fn();
      const ref = renderOpenable({ onOpen });

      act(() => ref.current?.open());
      act(() => ref.current?.open());

      expect(isOpen()).toBe(true);
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("closes through the ref and calls onClose with the toggle event", () => {
      const onClose = vi.fn();
      const ref = renderOpenable({ onClose });
      act(() => ref.current?.open());

      act(() => ref.current?.close());

      expect(isOpen()).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ newState: "closed" }));
    });

    it("works without onOpen and onClose", () => {
      const ref = renderOpenable();

      act(() => ref.current?.open());
      act(() => ref.current?.close());

      expect(isOpen()).toBe(false);
    });

    it("uses the latest onOpen and onClose callbacks", () => {
      const first = vi.fn();
      const second = vi.fn();
      const ref = createRef<DialogHandle>();
      const { rerender } = render(
        <Dialog ref={ref} title="Dialog title" onOpen={first} onClose={first}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      rerender(
        <Dialog ref={ref} title="Dialog title" onOpen={second} onClose={second}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      act(() => ref.current?.open());
      act(() => ref.current?.close());

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(2);
    });

    it("reacts when the browser toggles the popover by itself", () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      renderOpenable({ onOpen, onClose });

      act(() => {
        getDialog().togglePopover();
      });
      expect(onOpen).toHaveBeenCalledTimes(1);

      act(() => {
        getDialog().togglePopover();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes with the close button", () => {
      const onClose = vi.fn();
      const ref = renderOpenable({ onClose });
      act(() => ref.current?.open());

      fireEvent.click(screen.getByRole("button", { name: "Close", hidden: true }));

      expect(isOpen()).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("uses the custom close label", () => {
      renderOpenable({ closeLabel: "Fermer" });
      const button = screen.getByRole("button", { name: "Fermer", hidden: true });

      expect(button).toHaveAttribute("title", "Fermer");
    });
  });

  describe("focus management", () => {
    it("focuses the close button when the dialog opens", () => {
      const ref = renderOpenable();

      act(() => ref.current?.open());

      expect(screen.getByRole("button", { name: "Close", hidden: true })).toHaveFocus();
    });

    it("focuses the first focusable element when persistent", () => {
      const ref = createRef<DialogHandle>();
      render(
        <Dialog ref={ref} title="Dialog title" persistent>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Dialog>,
      );

      act(() => ref.current?.open());

      expect(screen.getByRole("button", { name: "First", hidden: true })).toHaveFocus();
    });

    it("focuses the dialog itself when it has no focusable element", () => {
      const ref = renderOpenable({ persistent: true });

      act(() => ref.current?.open());

      expect(getDialog()).toHaveFocus();
    });

    it("moves the focus to the last element when tabbing back from the first one", () => {
      render(
        <Dialog title="Dialog title" persistent>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Dialog>,
      );
      const [topAnchor, bottomAnchor] = Array.from(getDialog().querySelectorAll<HTMLElement>(".ds-focus-trap__button"));

      act(() => topAnchor.focus());
      expect(screen.getByRole("button", { name: "Last", hidden: true })).toHaveFocus();

      act(() => bottomAnchor.focus());
      expect(screen.getByRole("button", { name: "First", hidden: true })).toHaveFocus();
    });

    it("gives the focus back to the element that opened the dialog", () => {
      const ref = createRef<DialogHandle>();
      render(
        <>
          <button type="button">Opener</button>
          <Dialog ref={ref} title="Dialog title">
            <p>lorem Ipsum</p>
          </Dialog>
        </>,
      );
      const opener = screen.getByRole("button", { name: "Opener" });

      act(() => opener.focus());
      act(() => ref.current?.open());
      expect(opener).not.toHaveFocus();

      act(() => ref.current?.close());
      expect(opener).toHaveFocus();
    });

    it("does not restore the focus when the opener is no longer in the page", () => {
      const ref = createRef<DialogHandle>();
      render(
        <>
          <button type="button">Opener</button>
          <Dialog ref={ref} title="Dialog title">
            <p>lorem Ipsum</p>
          </Dialog>
        </>,
      );
      const opener = screen.getByRole("button", { name: "Opener" });

      act(() => opener.focus());
      act(() => ref.current?.open());
      Object.defineProperty(opener, "isConnected", { value: false });
      act(() => ref.current?.close());

      expect(document.body).toHaveFocus();
    });

    it("does nothing when no element was focused before opening", () => {
      const ref = renderOpenable();

      act(() => (document.activeElement as HTMLElement).blur());
      act(() => ref.current?.open());
      act(() => ref.current?.close());

      expect(document.body).toHaveFocus();
    });
  });
});
