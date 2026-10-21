import { render, screen, within } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import Breadcrumb from "./Breadcrumb";
import type { BreadcrumbItem } from "./Breadcrumb.types";

const items: BreadcrumbItem[] = [
  { label: "Home", href: "/", slotStart: <svg data-testid="home-icon" /> },
  { label: "Settings", href: "/settings" },
  { label: "Account", href: "/settings/account" },
  { label: "Members", href: "/settings/account/members" },
  { label: "Roles", href: "/settings/account/members/roles" },
];

const shortItems = items.slice(0, 2);
const currentPageLabel = "Team";

let containerWidth = 10000;
let notifyResize: () => void = () => undefined;

const resize = (width: number) => {
  containerWidth = width;
  act(() => notifyResize());
};

const getList = () => screen.getByRole("list");
const getEllipsis = () => document.querySelector<HTMLElement>(".ds-breadcrumb__ellipsis");

describe("Breadcrumb component", () => {
  beforeEach(() => {
    containerWidth = 10000;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return { width: this.tagName === "NAV" ? containerWidth : 100 } as DOMRect;
    });
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          notifyResize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should have no accessibility violations", async () => {
    containerWidth = 450;
    const { container } = render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  describe("structure", () => {
    it("renders a named navigation landmark with an ordered list", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);

      expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
      expect(getList().tagName).toBe("OL");
      expect(within(getList()).getAllByRole("listitem")).toHaveLength(3);
    });

    it("renders default classes", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      expect(screen.getByRole("navigation")).toHaveClass("ds-breadcrumb");
    });

    it("forwards native attributes and className", () => {
      render(
        <Breadcrumb
          currentPageLabel={currentPageLabel}
          items={shortItems}
          id="trail"
          className="custom"
          aria-label="Fil d'Ariane"
        />,
      );
      const nav = screen.getByRole("navigation", { name: "Fil d'Ariane" });

      expect(nav).toHaveAttribute("id", "trail");
      expect(nav).toHaveClass("ds-breadcrumb", "custom");
    });

    it("renders items with a href as links", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
    });

    it("renders items without a href as text", () => {
      render(
        <Breadcrumb
          currentPageLabel={currentPageLabel}
          items={[{ label: "Home", href: "/" }, { label: "Settings" }]}
        />,
      );
      const settings = screen.getByText("Settings").parentElement as HTMLElement;

      expect(screen.queryByRole("link", { name: "Settings" })).not.toBeInTheDocument();
      expect(settings.tagName).toBe("SPAN");
      expect(settings).toHaveClass("ds-breadcrumb__item");
    });

    it("renders the current page as plain text, not as a link", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      const current = screen.getByText("Team").parentElement as HTMLElement;

      expect(screen.queryByRole("link", { name: "Team" })).not.toBeInTheDocument();
      expect(current.tagName).toBe("SPAN");
      expect(current).toHaveAttribute("aria-current", "page");
      expect(current).toHaveClass("ds-breadcrumb__item--current");
      expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute("aria-current");
    });

    it("renders only the current page when there are no items", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={[]} homeAsIcon />);

      expect(within(getList()).getAllByRole("listitem")).toHaveLength(1);
      expect(screen.getByText("Team")).toBeInTheDocument();
    });
  });

  describe("slots and labels", () => {
    it("renders the slotStart before the label", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      const home = screen.getByRole("link", { name: "Home" });
      const slot = home.querySelector(".ds-breadcrumb__slot") as HTMLElement;

      expect(slot).toContainElement(screen.getByTestId("home-icon"));
      expect(slot.nextElementSibling).toHaveClass("ds-breadcrumb__label");
    });

    it("does not render a slot when slotStart is missing", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      expect(screen.getByRole("link", { name: "Settings" }).querySelector(".ds-breadcrumb__slot")).toBeNull();
    });

    it("shows the label of the first item by default", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      expect(screen.getByRole("link", { name: "Home" })).toHaveTextContent("Home");
    });

    it("replaces the first item with a house icon and sets its label as aria-label with homeAsIcon", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} homeAsIcon />);
      const home = screen.getByRole("link", { name: "Home" });

      expect(home.querySelector(".ds-breadcrumb__slot .ds-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("home-icon")).not.toBeInTheDocument();
      expect(home).toHaveAttribute("aria-label", "Home");
      expect(home).toHaveAttribute("title", "Home");
      expect(home).not.toHaveTextContent("Home");
      expect(screen.getByRole("link", { name: "Settings" })).toHaveTextContent("Settings");
    });
  });

  describe("divider", () => {
    it("renders a hidden icon between items, not before the first one", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      const entries = within(getList()).getAllByRole("listitem");

      expect(entries[0].querySelector(".ds-breadcrumb__divider")).toBeNull();
      expect(entries[1].querySelector(".ds-breadcrumb__divider")).toHaveAttribute("aria-hidden", "true");
    });

    it("renders the chosen icon as the divider", () => {
      const { rerender } = render(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} />);
      const before = within(getList()).getAllByRole("listitem")[1].querySelector(".ds-breadcrumb__divider")?.innerHTML;

      rerender(<Breadcrumb currentPageLabel={currentPageLabel} items={shortItems} divider="slash" />);
      const after = within(getList()).getAllByRole("listitem")[1].querySelector(".ds-breadcrumb__divider")?.innerHTML;

      expect(after).toBeTruthy();
      expect(after).not.toBe(before);
    });
  });

  describe("collapsing", () => {
    it("shows every item when the container is wide enough", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);

      expect(getEllipsis()).not.toBeInTheDocument();
      expect(within(getList()).getAllByRole("link")).toHaveLength(5);
      expect(screen.getByText("Team")).toBeInTheDocument();
    });

    it("collapses the middle items to fit the container", () => {
      containerWidth = 450;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      const links = within(getList()).getAllByRole("link");

      expect(links.map((link) => link.textContent)).toEqual(["Home", "…", "Roles"]);
      expect(getEllipsis()).toBeInTheDocument();
    });

    it("keeps the ellipsis in second position with a divider", () => {
      containerWidth = 450;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      const entries = within(getList()).getAllByRole("listitem");

      expect(entries).toHaveLength(4);
      expect(entries[1]).toContainElement(getEllipsis());
      expect(entries[1].querySelector(".ds-breadcrumb__divider")).toBeInTheDocument();
    });

    it("keeps only the first item, the ellipsis and the current page in a very narrow container", () => {
      containerWidth = 300;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      const links = within(getList()).getAllByRole("link");

      expect(links.map((link) => link.textContent)).toEqual(["Home", "…"]);
    });

    it("does not collapse a trail of two items", () => {
      containerWidth = 50;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items.slice(0, 1)} />);
      expect(getEllipsis()).not.toBeInTheDocument();
    });

    it("updates when the container is resized", () => {
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      expect(getEllipsis()).not.toBeInTheDocument();

      resize(450);
      expect(within(getList()).getAllByRole("link")).toHaveLength(3);

      resize(10000);
      expect(within(getList()).getAllByRole("link")).toHaveLength(5);
    });

    it("measures the items again when they change", () => {
      containerWidth = 450;
      const { rerender } = render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      expect(within(getList()).getAllByRole("link")).toHaveLength(3);

      rerender(<Breadcrumb currentPageLabel={currentPageLabel} items={items.slice(0, 4)} />);
      expect(getEllipsis()).toBeInTheDocument();
      expect(within(getList()).getAllByRole("link")).toHaveLength(3);

      rerender(<Breadcrumb currentPageLabel={currentPageLabel} items={items.slice(0, 3)} />);
      expect(getEllipsis()).not.toBeInTheDocument();
    });

    it("measures the items again once the fonts are loaded", async () => {
      let loaded: () => void = () => undefined;
      Object.defineProperty(document, "fonts", {
        configurable: true,
        value: { ready: new Promise<void>((resolve) => (loaded = resolve)) },
      });
      containerWidth = 450;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      expect(getEllipsis()).toBeInTheDocument();

      await act(async () => {
        loaded();
        await Promise.resolve();
      });
      expect(getEllipsis()).toBeInTheDocument();
      Reflect.deleteProperty(document, "fonts");
    });

    it("ignores the fonts once unmounted", async () => {
      let loaded: () => void = () => undefined;
      Object.defineProperty(document, "fonts", {
        configurable: true,
        value: { ready: new Promise<void>((resolve) => (loaded = resolve)) },
      });
      const { unmount } = render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      unmount();

      await act(async () => {
        loaded();
        await Promise.resolve();
      });
      Reflect.deleteProperty(document, "fonts");
    });

    it("works without ResizeObserver", () => {
      vi.stubGlobal("ResizeObserver", undefined);
      containerWidth = 450;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);
      expect(getEllipsis()).toBeInTheDocument();
    });

    it("links the ellipsis to the last hidden page", () => {
      containerWidth = 450;
      render(<Breadcrumb currentPageLabel={currentPageLabel} items={items} />);

      expect(getEllipsis()).toHaveAttribute("href", "/settings/account/members");
      expect(getEllipsis()).toHaveAttribute("aria-label", "Members");
      expect(getEllipsis()).toHaveAttribute("title", "Members");
      expect(getEllipsis()).toHaveClass("ds-breadcrumb__ellipsis");
    });

    it("links the ellipsis to the closest hidden page that has a href", () => {
      containerWidth = 450;
      render(
        <Breadcrumb
          currentPageLabel={currentPageLabel}
          items={[...items.slice(0, 3), { label: "Members" }, ...items.slice(4)]}
        />,
      );

      expect(screen.getByRole("link", { name: "Account" })).toHaveClass("ds-breadcrumb__ellipsis");
      expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute("href", "/settings/account");
    });

    it("renders the ellipsis as text when no hidden page has a href", () => {
      containerWidth = 450;
      render(
        <Breadcrumb
          currentPageLabel={currentPageLabel}
          items={[items[0], { label: "Settings" }, { label: "Account" }, { label: "Members" }, ...items.slice(4)]}
        />,
      );
      const ellipsis = screen.getByRole("img", { name: "Members" });

      expect(ellipsis.tagName).toBe("SPAN");
      expect(ellipsis).toHaveTextContent("…");
    });
  });
});
