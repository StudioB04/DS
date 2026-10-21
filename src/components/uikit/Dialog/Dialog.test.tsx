import { act, createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import Dialog from "./Dialog";
import type { DialogHandle, DialogProps } from "./Dialog.types";

const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
const close = vi.fn(function (this: HTMLDialogElement) {
  if (!this.hasAttribute("open")) return;
  this.removeAttribute("open");
  if (this.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
  this.dispatchEvent(new Event("close"));
});

const getDialog = () => document.querySelector("dialog") as HTMLDialogElement;

describe("Dialog component", () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = showModal;
    HTMLDialogElement.prototype.close = close;
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

    const { container: opened } = render(
      <Dialog open title="Dialog title" description="Dialog description">
        <p>lorem Ipsum</p>
      </Dialog>,
    );
    expect(await axe(opened, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
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

  describe("opening and closing", () => {
    it("is closed by default", () => {
      render(
        <Dialog title="Dialog title">
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      expect(getDialog()).not.toHaveAttribute("open");
    });

    it("opens as a modal and calls onOpen when open is true", () => {
      const onOpen = vi.fn();
      render(
        <Dialog title="Dialog title" open onOpen={onOpen}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      expect(showModal).toHaveBeenCalledTimes(1);
      expect(getDialog()).toHaveAttribute("open");
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("follows the open prop", () => {
      const onClose = vi.fn();
      const { rerender } = render(
        <Dialog title="Dialog title" open onClose={onClose}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      rerender(
        <Dialog title="Dialog title" open={false} onClose={onClose}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      expect(getDialog()).not.toHaveAttribute("open");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("exposes open and close through the ref", () => {
      const ref = createRef<DialogHandle>();
      const onOpen = vi.fn();
      const onClose = vi.fn();
      render(
        <Dialog title="Dialog title" ref={ref} onOpen={onOpen} onClose={onClose}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      act(() => ref.current?.open());
      act(() => ref.current?.open());
      expect(getDialog()).toHaveAttribute("open");
      expect(onOpen).toHaveBeenCalledTimes(1);

      act(() => ref.current?.close());
      expect(getDialog()).not.toHaveAttribute("open");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("uses the latest onOpen callback", () => {
      const first = vi.fn();
      const second = vi.fn();
      const ref = createRef<DialogHandle>();
      const { rerender } = render(
        <Dialog title="Dialog title" ref={ref} onOpen={first}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      rerender(
        <Dialog title="Dialog title" ref={ref} onOpen={second}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      act(() => ref.current?.open());

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });

    it("closes with the close button", () => {
      const onClose = vi.fn();
      render(
        <Dialog title="Dialog title" open onClose={onClose}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Close", hidden: true }));

      expect(getDialog()).not.toHaveAttribute("open");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("uses the custom close label", () => {
      render(
        <Dialog title="Dialog title" closeLabel="Fermer">
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      const button = screen.getByRole("button", { name: "Fermer", hidden: true });

      expect(button).toHaveAttribute("title", "Fermer");
    });
  });

  describe("closing by interaction", () => {
    const renderOpen = (props: Partial<DialogProps> = {}) => {
      render(
        <Dialog open title="Dialog title" {...props}>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
    };

    it("lets the browser close the dialog with Escape", () => {
      renderOpen();
      expect(fireEvent.keyDown(getDialog(), { key: "Escape" })).toBe(true);
    });

    it("prevents Escape from closing a persistent dialog", () => {
      renderOpen({ persistent: true });
      expect(fireEvent.keyDown(getDialog(), { key: "Escape" })).toBe(false);
    });

    it("ignores the other keys on a persistent dialog", () => {
      renderOpen({ persistent: true });
      expect(fireEvent.keyDown(getDialog(), { key: "a" })).toBe(true);
    });

    it("renders no close button when persistent", () => {
      renderOpen({ persistent: true });

      expect(getDialog()).toHaveClass("ds-dialog--persistent");
      expect(screen.queryByRole("button", { name: "Close", hidden: true })).not.toBeInTheDocument();
    });

    it("closes when the backdrop is clicked", () => {
      renderOpen();

      fireEvent.mouseDown(getDialog());
      fireEvent.click(getDialog());

      expect(getDialog()).not.toHaveAttribute("open");
    });

    it("does not close when the content is clicked", () => {
      renderOpen();
      const body = getDialog().querySelector(".ds-dialog__body") as HTMLElement;

      fireEvent.mouseDown(body);
      fireEvent.click(body);

      expect(getDialog()).toHaveAttribute("open");
    });

    it("does not close when a selection started in the content ends on the backdrop", () => {
      renderOpen();

      fireEvent.mouseDown(getDialog().querySelector(".ds-dialog__body") as HTMLElement);
      fireEvent.click(getDialog());

      expect(getDialog()).toHaveAttribute("open");
    });

    it("does not close on a backdrop click when persistent", () => {
      renderOpen({ persistent: true });

      fireEvent.mouseDown(getDialog());
      fireEvent.click(getDialog());

      expect(getDialog()).toHaveAttribute("open");
    });

    it("uses the current persistent value after it changes", () => {
      const { rerender } = render(
        <Dialog title="Dialog title" open>
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      rerender(
        <Dialog title="Dialog title" open persistent>
          <p>lorem Ipsum</p>
        </Dialog>,
      );
      fireEvent.mouseDown(getDialog());
      fireEvent.click(getDialog());

      expect(getDialog()).toHaveAttribute("open");
    });
  });

  describe("focus management", () => {
    it("focuses the close button when the dialog opens", () => {
      render(
        <Dialog open title="Dialog title">
          <button type="button">Action</button>
        </Dialog>,
      );

      expect(screen.getByRole("button", { name: "Close", hidden: true })).toHaveFocus();
    });

    it("focuses the first focusable element when persistent", () => {
      render(
        <Dialog open persistent title="Dialog title">
          <button type="button">First</button>
          <button type="button">Second</button>
        </Dialog>,
      );

      expect(screen.getByRole("button", { name: "First", hidden: true })).toHaveFocus();
    });

    it("focuses the dialog itself when it has no focusable element", () => {
      render(
        <Dialog open persistent title="Dialog title">
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      expect(getDialog()).toHaveFocus();
    });

    it("moves the focus to the last element when tabbing back from the first one", () => {
      render(
        <Dialog title="Dialog title" open persistent>
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
      const ref = createRef<DialogHandle>();
      render(
        <Dialog ref={ref} title="Dialog title">
          <p>lorem Ipsum</p>
        </Dialog>,
      );

      act(() => (document.activeElement as HTMLElement).blur());
      act(() => ref.current?.open());
      act(() => ref.current?.close());

      expect(document.body).toHaveFocus();
    });
  });
});
