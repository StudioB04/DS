import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import StudioB04Provider from "./StudioB04Provider";
import useDialog from "./useDialog";
import type { DialogOptions } from "./StudioB04Provider.types";

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
const getAnimations = vi.fn((): Animation[] => []);
const focusDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "focus") as PropertyDescriptor;
const nativeFocus = focusDescriptor.value as (this: HTMLElement, options?: FocusOptions) => void;

const getDialogs = () => document.querySelectorAll("dialog");

const flush = () => act(async () => {});

function Opener({ options, label = "Open" }: { options: DialogOptions; label?: string }) {
  const { showDialog, hideDialog } = useDialog();

  return (
    <>
      <button type="button" onClick={() => showDialog(options)}>
        {label}
      </button>
      <button type="button" onClick={hideDialog}>
        Hide
      </button>
    </>
  );
}

const renderProvider = (options: DialogOptions = { title: "First dialog", children: <p>First content</p> }) =>
  render(
    <StudioB04Provider>
      <Opener options={options} />
    </StudioB04Provider>,
  );

describe("StudioB04Provider component", () => {
  beforeEach(() => {
    HTMLElement.prototype.togglePopover = togglePopover;
    HTMLElement.prototype.getAnimations = getAnimations;
    HTMLElement.prototype.focus = function (this: HTMLElement, options?: FocusOptions) {
      if (this.closest("dialog:not([data-popover-open])")) return;
      nativeFocus.call(this, options);
    };
  });

  afterEach(() => {
    HTMLElement.prototype.focus = nativeFocus;
    vi.clearAllMocks();
    getAnimations.mockImplementation(() => []);
  });

  it("should have no accessibility violations", async () => {
    const { container } = renderProvider();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
    expect(await axe(document.body, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("renders its children and no dialog by default", () => {
    renderProvider();

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(getDialogs()).toHaveLength(0);
  });

  it("opens a dialog with the given options", () => {
    const onOpen = vi.fn();
    renderProvider({ title: "First dialog", size: "lg", onOpen, children: <p>First content</p> });

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(getDialogs()).toHaveLength(1);
    expect(getDialogs()[0]).toHaveAttribute("data-popover-open");
    expect(getDialogs()[0]).toHaveClass("ds-dialog--size-lg");
    expect(screen.getByRole("heading", { name: "First dialog", hidden: true })).toBeInTheDocument();
    expect(screen.getByText("First content")).toBeInTheDocument();
    expect(togglePopover).toHaveBeenCalledWith(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("closes the dialog with hideDialog and unmounts it once the animations are finished", async () => {
    const onClose = vi.fn();
    renderProvider({ title: "First dialog", onClose, children: <p>First content</p> });
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    await flush();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(getDialogs()).toHaveLength(0);
  });

  it("closes the dialog with its own close button", async () => {
    const onClose = vi.fn();
    renderProvider({ title: "First dialog", onClose, children: <p>First content</p> });
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Close", hidden: true }));
    await flush();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(getDialogs()).toHaveLength(0);
  });

  it("works without an onClose option", async () => {
    renderProvider();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    await flush();

    expect(getDialogs()).toHaveLength(0);
  });

  it("keeps the dialog mounted while its animations are running", async () => {
    let finish = () => {};
    const finished = new Promise<Animation>((resolve) => {
      finish = () => resolve({} as Animation);
    });
    getAnimations.mockImplementation(() => [{ finished } as Animation]);
    renderProvider();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    await flush();
    expect(getDialogs()).toHaveLength(1);
    expect(getDialogs()[0]).not.toHaveAttribute("data-popover-open");

    finish();
    await flush();
    expect(getDialogs()).toHaveLength(0);
  });

  it("unmounts the dialog even if an animation is cancelled", async () => {
    getAnimations.mockImplementation(() => [{ finished: Promise.reject(new Error("cancelled")) } as Animation]);
    renderProvider();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    await flush();

    expect(getDialogs()).toHaveLength(0);
  });

  it("does nothing when hideDialog is called without any dialog", async () => {
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    await flush();

    expect(getDialogs()).toHaveLength(0);
  });

  it("replaces the current dialog when another one is shown", () => {
    render(
      <StudioB04Provider>
        <Opener options={{ title: "First dialog", children: <p>First content</p> }} label="Open first" />
        <Opener options={{ title: "Second dialog", children: <p>Second content</p> }} label="Open second" />
      </StudioB04Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open first" }));
    fireEvent.click(screen.getByRole("button", { name: "Open second", hidden: true }));

    expect(getDialogs()).toHaveLength(1);
    expect(getDialogs()[0]).toHaveAttribute("data-popover-open");
    expect(screen.getByRole("heading", { name: "Second dialog", hidden: true })).toBeInTheDocument();
    expect(screen.queryByText("First content")).not.toBeInTheDocument();
  });

  it("does not unmount a newer dialog when the previous one finishes closing", async () => {
    let finish = () => {};
    const finished = new Promise<Animation>((resolve) => {
      finish = () => resolve({} as Animation);
    });
    getAnimations.mockImplementationOnce(() => [{ finished } as Animation]);
    render(
      <StudioB04Provider>
        <Opener options={{ title: "First dialog", children: <p>First content</p> }} label="Open first" />
        <Opener options={{ title: "Second dialog", children: <p>Second content</p> }} label="Open second" />
      </StudioB04Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open first" }));

    fireEvent.click(screen.getAllByRole("button", { name: "Hide", hidden: true })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Open second", hidden: true }));
    finish();
    await flush();

    expect(screen.getByRole("heading", { name: "Second dialog", hidden: true })).toBeInTheDocument();
  });

  describe("focus", () => {
    const renderTwoOpeners = () =>
      render(
        <StudioB04Provider>
          <Opener options={{ title: "First dialog", children: <p>First content</p> }} label="Open first" />
          <Opener options={{ title: "Second dialog", children: <p>Second content</p> }} label="Open second" />
        </StudioB04Provider>,
      );

    it("gives the focus back to the element that opened the dialog", async () => {
      renderProvider();
      const opener = screen.getByRole("button", { name: "Open" });

      act(() => opener.focus());
      fireEvent.click(opener);
      fireEvent.click(screen.getByRole("button", { name: "Hide", hidden: true }));
      await flush();

      expect(opener).toHaveFocus();
    });

    it("gives the focus back to the first opener when a dialog replaced another one", async () => {
      renderTwoOpeners();
      const first = screen.getByRole("button", { name: "Open first" });

      act(() => first.focus());
      fireEvent.click(first);
      fireEvent.click(screen.getByRole("button", { name: "Open second", hidden: true }));
      fireEvent.click(screen.getAllByRole("button", { name: "Hide", hidden: true })[1]);
      await flush();

      expect(first).toHaveFocus();
    });

    it("remembers a new opener once the previous dialog is closed", async () => {
      renderTwoOpeners();
      const first = screen.getByRole("button", { name: "Open first" });
      const second = screen.getByRole("button", { name: "Open second" });

      act(() => first.focus());
      fireEvent.click(first);
      fireEvent.click(screen.getAllByRole("button", { name: "Hide", hidden: true })[0]);
      await flush();

      act(() => second.focus());
      fireEvent.click(second);
      fireEvent.click(screen.getAllByRole("button", { name: "Hide", hidden: true })[0]);
      await flush();

      expect(second).toHaveFocus();
    });

    it("does not restore the focus when the opener is no longer in the page", async () => {
      renderProvider();
      const opener = screen.getByRole("button", { name: "Open" });

      act(() => opener.focus());
      fireEvent.click(opener);
      Object.defineProperty(opener, "isConnected", { value: false });
      fireEvent.click(screen.getByRole("button", { name: "Hide", hidden: true }));
      await flush();

      expect(document.body).toHaveFocus();
    });

    it("does nothing when no element had the focus before opening", async () => {
      renderProvider();

      act(() => (document.activeElement as HTMLElement).blur());
      fireEvent.click(screen.getByRole("button", { name: "Open" }));
      act(() => (document.activeElement as HTMLElement).blur());
      fireEvent.click(screen.getByRole("button", { name: "Hide", hidden: true }));
      await flush();

      expect(document.body).toHaveFocus();
    });
  });

  it("keeps stable showDialog and hideDialog functions", () => {
    const seen: unknown[] = [];

    function Spy() {
      const { showDialog, hideDialog } = useDialog();
      seen.push(showDialog, hideDialog);
      return null;
    }

    const { rerender } = render(
      <StudioB04Provider>
        <Spy />
      </StudioB04Provider>,
    );
    rerender(
      <StudioB04Provider>
        <Spy />
      </StudioB04Provider>,
    );

    expect(seen).toHaveLength(4);
    expect(seen[0]).toBe(seen[2]);
    expect(seen[1]).toBe(seen[3]);
  });

  it("throws when useDialog is used outside of the provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Opener options={{ title: "Dialog", children: null }} />)).toThrow(
      "useDialog must be used within a StudioB04Provider",
    );

    error.mockRestore();
  });
});
