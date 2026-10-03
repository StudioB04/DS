import { act, createEvent, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import Slider from "./Slider";

class TestPointerEvent extends MouseEvent {
  pointerId: number;
  pointerType: string;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 0;
    this.pointerType = init.pointerType ?? "";
  }
}

window.PointerEvent ??= TestPointerEvent as typeof PointerEvent;

const items = ["One", "Two", "Three", "Four"].map((name) => <p key={name}>{name}</p>);

function getCarousel() {
  return document.querySelector("section.ds-slider") as HTMLElement;
}

function getTrack() {
  return screen.getByRole("list");
}

function mockLayout(slideWidth = 100, clientWidth = 250) {
  const track = getTrack();
  const slides = Array.from(track.children) as HTMLElement[];
  let scrollLeft = 0;

  slides.forEach((slide, i) => {
    Object.defineProperty(slide, "offsetLeft", { configurable: true, value: i * slideWidth });
    Object.defineProperty(slide, "offsetWidth", { configurable: true, value: slideWidth });
  });
  Object.defineProperty(track, "clientWidth", { configurable: true, value: clientWidth });
  Object.defineProperty(track, "scrollWidth", { configurable: true, value: slides.length * slideWidth });
  Object.defineProperty(track, "scrollLeft", {
    configurable: true,
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value;
    },
  });

  const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
    scrollLeft = Math.min(left ?? 0, slides.length * slideWidth - clientWidth);
    fireEvent.scroll(track);
  });
  track.scrollTo = scrollTo as typeof track.scrollTo;
  fireEvent.scroll(track);

  return scrollTo;
}

describe("Slider component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Slider items={items} />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  it("should have no accessibility violations with dots and autoplay", async () => {
    const { container } = render(<Slider items={items} dots autoPlay={5000} />);
    expect(await axe(container, { rules: { "color-contrast": { enabled: false } } })).toHaveNoViolations();
  });

  describe("structure", () => {
    it("renders a carousel section", () => {
      render(<Slider items={items} />);

      expect(getCarousel().tagName).toBe("SECTION");
      expect(getCarousel()).toHaveAttribute("aria-roledescription", "carousel");
    });

    it("becomes a named region with an aria-label", () => {
      render(<Slider items={items} aria-label="Featured products" />);
      expect(screen.getByRole("region", { name: "Featured products" })).toBeInTheDocument();
    });

    it("renders each item in a list item, inside a slide group", () => {
      render(<Slider items={items} />);
      const listItems = within(getTrack()).getAllByRole("listitem");
      const slides = screen.getAllByRole("group");

      expect(listItems).toHaveLength(4);
      expect(slides).toHaveLength(4);
      expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
      expect(within(slides[0]).getByText("One")).toBeInTheDocument();
    });

    it("makes the list focusable and politely live when not rotating", () => {
      render(<Slider items={items} />);

      expect(getTrack()).toHaveAttribute("tabindex", "0");
      expect(getTrack()).toHaveAttribute("aria-live", "polite");
      expect(getTrack()).toHaveAttribute("aria-atomic", "false");
    });

    it("forwards native attributes, className and style", () => {
      render(<Slider items={items} id="slider" className="custom" style={{ marginTop: "8px" }} />);
      const region = getCarousel();

      expect(region).toHaveAttribute("id", "slider");
      expect(region).toHaveClass("ds-slider", "custom");
      expect(region.style.marginTop).toBe("8px");
    });
  });

  describe("arrows", () => {
    it("renders previous and next buttons by default", () => {
      render(<Slider items={items} />);

      expect(screen.getByTitle("Previous slide")).toBeInTheDocument();
      expect(screen.getByTitle("Next slide")).toBeInTheDocument();
    });

    it("hides the buttons when arrows is false", () => {
      render(<Slider items={items} arrows={false} />);

      expect(screen.queryByTitle("Previous slide")).not.toBeInTheDocument();
      expect(screen.queryByTitle("Next slide")).not.toBeInTheDocument();
    });

    it("goes to the next and previous slides", async () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();

      await userEvent.click(screen.getByTitle("Next slide"));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 100 });

      await userEvent.click(screen.getByTitle("Previous slide"));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
    });

    it("disables previous at the start and next at the end, without looping", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();
      const previousButton = screen.getByTitle("Previous slide");
      const nextButton = screen.getByTitle("Next slide");

      expect(previousButton).toHaveAttribute("aria-disabled", "true");
      expect(nextButton).toHaveAttribute("aria-disabled", "false");
      fireEvent.click(previousButton);
      expect(scrollTo).not.toHaveBeenCalled();

      fireEvent.keyDown(getTrack(), { key: "End" });
      expect(nextButton).toHaveAttribute("aria-disabled", "true");
      expect(previousButton).toHaveAttribute("aria-disabled", "false");
      fireEvent.click(nextButton);
      fireEvent.keyDown(getTrack(), { key: "ArrowRight" });
      expect(scrollTo).toHaveBeenCalledTimes(1);
    });

    it("goes page by page with slidePerPage", async () => {
      render(<Slider items={[...items, <p key="five">Five</p>, <p key="six">Six</p>]} slidePerPage />);
      const scrollTo = mockLayout();

      await userEvent.click(screen.getByTitle("Next slide"));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 200 });

      await userEvent.click(screen.getByTitle("Previous slide"));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
    });
  });

  describe("keyboard", () => {
    it("navigates with the arrow keys, Home and End when the list is focused", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();
      const track = getTrack();

      fireEvent.keyDown(track, { key: "ArrowRight" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 100 });

      fireEvent.keyDown(track, { key: "ArrowLeft" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });

      fireEvent.keyDown(track, { key: "End" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 300 });

      fireEvent.keyDown(track, { key: "Home" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
    });

    it("ignores other keys", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();

      fireEvent.keyDown(getTrack(), { key: "Enter" });
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("ignores the keys typed in a form field inside a slide", () => {
      render(<Slider items={[<input key="field" aria-label="Search" />, ...items]} />);
      const scrollTo = mockLayout();

      fireEvent.keyDown(screen.getByRole("textbox", { name: "Search" }), { key: "ArrowRight" });
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("does nothing when there is no slide to go to", () => {
      render(<Slider items={[]} />);
      const scrollTo = mockLayout();

      fireEvent.keyDown(getTrack(), { key: "End" });
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("dots", () => {
    it("renders a single focusable tab list, with one tab per slide, and tab panels", () => {
      render(<Slider items={items} dots />);
      const tablist = screen.getByRole("tablist");
      const tabs = within(tablist).getAllByRole("tab");
      const panels = screen.getAllByRole("tabpanel");

      expect(tablist).toHaveAttribute("tabindex", "0");
      expect(tablist).toHaveAttribute("aria-activedescendant", tabs[0].id);
      expect(tabs).toHaveLength(4);
      tabs.forEach((tab) => expect(tab).toHaveAttribute("tabindex", "-1"));
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      expect(tabs[0]).toHaveAttribute("aria-controls", panels[0].id);
      expect(panels[0]).toHaveAttribute("aria-roledescription", "slide");
    });

    it("goes to the slide of the clicked tab and selects it", async () => {
      render(<Slider items={items} dots />);
      const scrollTo = mockLayout();
      const tabs = screen.getAllByRole("tab");

      await userEvent.click(tabs[1]);

      expect(scrollTo).toHaveBeenLastCalledWith({ left: 100 });
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tablist")).toHaveAttribute("aria-activedescendant", tabs[1].id);
    });

    it("selects the last tab when the list is scrolled to the end", () => {
      render(<Slider items={items} dots />);
      mockLayout();

      fireEvent.keyDown(getTrack(), { key: "End" });
      expect(screen.getAllByRole("tab")[3]).toHaveAttribute("aria-selected", "true");
    });

    it("navigates the carousel with the arrow keys, Home and End, while the list keeps the focus", () => {
      render(<Slider items={items} dots />);
      const scrollTo = mockLayout();
      const tablist = screen.getByRole("tablist");
      tablist.focus();

      fireEvent.keyDown(tablist, { key: "ArrowRight" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 100 });
      expect(tablist).toHaveAttribute("aria-activedescendant", screen.getAllByRole("tab")[1].id);

      fireEvent.keyDown(tablist, { key: "ArrowLeft" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });

      fireEvent.keyDown(tablist, { key: "End" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 300 });

      fireEvent.keyDown(tablist, { key: "Home" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
      expect(tablist).toHaveFocus();
    });

    it("ignores other keys on the tab list", () => {
      render(<Slider items={items} dots />);
      const scrollTo = mockLayout();

      fireEvent.keyDown(screen.getByRole("tablist"), { key: "Enter" });
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("autoplay", () => {
    it("renders no rotation controls by default or with a 0 delay", () => {
      const { rerender, container } = render(<Slider items={items} />);
      expect(container.querySelector(".ds-slider__controls")).not.toBeInTheDocument();

      rerender(<Slider items={items} autoPlay={0} />);
      expect(container.querySelector(".ds-slider__controls")).not.toBeInTheDocument();
    });

    it("renders the rotation button first, and a hidden progress bar", () => {
      const { container } = render(<Slider items={items} autoPlay={5000} arrows dots />);
      const buttons = screen.getAllByRole("button");

      expect(buttons[0]).toHaveAccessibleName("Stop automatic slide show");
      expect(container.querySelector(".ds-slider__progress")).toHaveAttribute("aria-hidden", "true");
      expect(getTrack()).toHaveAttribute("aria-live", "off");
    });

    it("uses the given delay", () => {
      render(<Slider items={items} autoPlay={3000} />);
      expect(getCarousel().style.getPropertyValue("--ds-slider-delay")).toBe("3000ms");
    });

    it("goes to the next slide at the end of the progress bar, and loops", () => {
      const { container } = render(<Slider items={items} autoPlay={5000} />);
      const scrollTo = mockLayout();
      const progress = () => container.querySelector(".ds-slider__progress-bar") as HTMLElement;

      fireEvent.animationEnd(progress());
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 100 });

      fireEvent.keyDown(getTrack(), { key: "End" });
      fireEvent.animationEnd(progress());
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0 });
    });

    it("stops and restarts with the rotation button", async () => {
      render(<Slider items={items} autoPlay={5000} />);

      await userEvent.click(screen.getByRole("button", { name: "Stop automatic slide show" }));
      expect(getCarousel()).toHaveClass("ds-slider--paused");
      expect(getTrack()).toHaveAttribute("aria-live", "polite");

      await userEvent.click(screen.getByRole("button", { name: "Start automatic slide show" }));
      expect(getCarousel()).not.toHaveClass("ds-slider--paused");
      expect(getTrack()).toHaveAttribute("aria-live", "off");
    });

    it("pauses while hovered", () => {
      const { container } = render(<Slider items={items} autoPlay={5000} />);
      const inner = container.querySelector(".ds-slider__inner") as HTMLElement;

      fireEvent.mouseEnter(inner);
      expect(getCarousel()).toHaveClass("ds-slider--paused");

      fireEvent.mouseLeave(inner);
      expect(getCarousel()).not.toHaveClass("ds-slider--paused");
    });

    it("rotates while hovered once restarted explicitly, until the mouse leaves", () => {
      const { container } = render(<Slider items={items} autoPlay={5000} />);
      const inner = container.querySelector(".ds-slider__inner") as HTMLElement;
      const button = () => screen.getByRole("button", { name: /automatic slide show/ });

      fireEvent.click(button());
      fireEvent.mouseEnter(inner);
      fireEvent.click(button());
      expect(getCarousel()).not.toHaveClass("ds-slider--paused");

      fireEvent.mouseLeave(inner);
      fireEvent.mouseEnter(inner);
      expect(getCarousel()).toHaveClass("ds-slider--paused");
    });

    it("stops when keyboard focus enters the carousel, not when it moves inside", async () => {
      render(
        <>
          <button type="button">Before</button>
          <Slider items={items} autoPlay={5000} />
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "Start automatic slide show" })).toHaveFocus();

      await userEvent.click(screen.getByRole("button", { name: "Start automatic slide show" }));
      await userEvent.tab();
      expect(screen.getByTitle("Previous slide")).toHaveFocus();
      expect(screen.getByRole("button", { name: "Stop automatic slide show" })).toBeInTheDocument();
    });

    it("stops with a mouse click on the rotation button, coming from outside", async () => {
      render(
        <>
          <button type="button">Before</button>
          <Slider items={items} autoPlay={5000} />
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await userEvent.click(screen.getByRole("button", { name: "Stop automatic slide show" }));

      expect(screen.getByRole("button", { name: "Start automatic slide show" })).toHaveFocus();
      expect(getCarousel()).toHaveClass("ds-slider--paused");
    });
  });

  describe("loop", () => {
    const setScroll = (left: number) => {
      getTrack().scrollLeft = left;
      fireEvent.scroll(getTrack());
    };

    it("renders hidden and inert clones before and after the slides", () => {
      const { container } = render(<Slider items={items} loop />);
      const clones = container.querySelectorAll(".ds-slider__slide[aria-hidden='true']");

      expect(container.querySelectorAll(".ds-slider__slide")).toHaveLength(12);
      expect(clones).toHaveLength(8);
      clones.forEach((clone) => expect(clone).toHaveAttribute("inert"));
      expect(within(getTrack()).getAllByRole("listitem")).toHaveLength(4);
      expect(screen.getAllByRole("group")).toHaveLength(4);
    });

    it("starts on the first real slide", () => {
      const scrollTo = vi.fn();
      HTMLElement.prototype.scrollTo = scrollTo;
      render(<Slider items={items} loop />);

      expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "instant" });
      delete (HTMLElement.prototype as Partial<HTMLElement>).scrollTo;
    });

    it("does not fail where scrollTo is not supported", () => {
      render(<Slider items={items} loop />);
      expect(() => fireEvent.click(screen.getByTitle("Next slide"))).not.toThrow();
    });

    it("never disables the arrows", () => {
      render(<Slider items={items} loop />);
      mockLayout();

      expect(screen.getByTitle("Previous slide")).toHaveAttribute("aria-disabled", "false");
      expect(screen.getByTitle("Next slide")).toHaveAttribute("aria-disabled", "false");
    });

    it("goes forward from the last slide to the first one, then recenters on the real slides", () => {
      vi.useFakeTimers();
      render(<Slider items={items} loop dots />);
      const scrollTo = mockLayout();

      setScroll(700);
      expect(screen.getAllByRole("tab")[3]).toHaveAttribute("aria-selected", "true");

      fireEvent.click(screen.getByTitle("Next slide"));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 800 });
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");

      vi.advanceTimersByTime(150);
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 400, behavior: "instant" });
      vi.useRealTimers();
    });

    it("goes backward from the first slide to the last one, then recenters on the real slides", () => {
      vi.useFakeTimers();
      render(<Slider items={items} loop dots />);
      const scrollTo = mockLayout();

      setScroll(400);
      fireEvent.click(screen.getByTitle("Previous slide"));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 300 });
      expect(screen.getAllByRole("tab")[3]).toHaveAttribute("aria-selected", "true");

      vi.advanceTimersByTime(150);
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 700, behavior: "instant" });
      vi.useRealTimers();
    });

    it("targets the real slides with the dots, Home and End", () => {
      render(<Slider items={items} loop dots />);
      const scrollTo = mockLayout();

      fireEvent.click(screen.getAllByRole("tab")[1]);
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 500 });

      fireEvent.keyDown(getTrack(), { key: "End" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 700 });

      fireEvent.keyDown(getTrack(), { key: "Home" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 400 });

      fireEvent.keyDown(screen.getByRole("tablist"), { key: "End" });
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 700 });
    });

    it("keeps going forward with autoplay", () => {
      const { container } = render(<Slider items={items} loop autoPlay={5000} />);
      const scrollTo = mockLayout();

      setScroll(700);
      fireEvent.animationEnd(container.querySelector(".ds-slider__progress-bar") as HTMLElement);
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 800 });
    });
  });

  describe("edge fade", () => {
    it("fades no edge when every slide fits", () => {
      render(<Slider items={items} />);

      expect(getCarousel()).not.toHaveClass("ds-slider--fade-start");
      expect(getCarousel()).not.toHaveClass("ds-slider--fade-end");
    });

    it("fades the edges that have more slides beyond them", () => {
      render(<Slider items={items} />);
      mockLayout();
      const track = getTrack();

      expect(getCarousel()).not.toHaveClass("ds-slider--fade-start");
      expect(getCarousel()).toHaveClass("ds-slider--fade-end");

      track.scrollLeft = 100;
      fireEvent.scroll(track);
      expect(getCarousel()).toHaveClass("ds-slider--fade-start", "ds-slider--fade-end");

      fireEvent.keyDown(track, { key: "End" });
      expect(getCarousel()).toHaveClass("ds-slider--fade-start");
      expect(getCarousel()).not.toHaveClass("ds-slider--fade-end");
    });

    it("updates the edges as soon as a scroll towards them starts", () => {
      vi.useFakeTimers();
      render(<Slider items={items} />);
      mockLayout();
      const track = getTrack();
      track.scrollTo = vi.fn() as typeof track.scrollTo;

      fireEvent.keyDown(track, { key: "End" });
      expect(getCarousel()).toHaveClass("ds-slider--fade-start");
      expect(getCarousel()).not.toHaveClass("ds-slider--fade-end");

      track.scrollLeft = 50;
      fireEvent.scroll(track);
      expect(getCarousel()).not.toHaveClass("ds-slider--fade-end");

      track.scrollLeft = 150;
      fireEvent.scroll(track);
      expect(getCarousel()).not.toHaveClass("ds-slider--fade-end");
      expect(screen.getByTitle("Next slide")).toHaveAttribute("aria-disabled", "true");
      vi.useRealTimers();
    });

    it("restores the edges when the scroll stops before its target", () => {
      vi.useFakeTimers();
      render(<Slider items={items} />);
      mockLayout();
      const track = getTrack();
      track.scrollTo = vi.fn() as typeof track.scrollTo;

      fireEvent.keyDown(track, { key: "End" });
      track.scrollLeft = 50;
      fireEvent.scroll(track);
      act(() => vi.advanceTimersByTime(150));

      expect(getCarousel()).toHaveClass("ds-slider--fade-start", "ds-slider--fade-end");
      vi.useRealTimers();
    });

    it("always fades both edges with loop", () => {
      render(<Slider items={items} loop />);
      expect(getCarousel()).toHaveClass("ds-slider--fade-start", "ds-slider--fade-end");
    });
  });

  describe("height", () => {
    const mockHeights = (heights: number[]) =>
      Array.from(getTrack().children).forEach((slide, i) =>
        Object.defineProperty(slide.firstElementChild, "offsetHeight", { configurable: true, value: heights[i] }),
      );

    it("keeps its natural height until a slide is visible", () => {
      render(<Slider items={items} />);

      expect(getTrack().style.getPropertyValue("--ds-slider-height")).toBe("");
    });

    it("fits the tallest visible slide", () => {
      render(<Slider items={items} />);
      mockHeights([50, 80, 120, 300]);
      mockLayout();
      const track = getTrack();

      expect(track.style.getPropertyValue("--ds-slider-height")).toBe("120px");

      track.scrollLeft = 150;
      fireEvent.scroll(track);
      expect(track.style.getPropertyValue("--ds-slider-height")).toBe("300px");
    });

    it("fits the slides visible at the scroll target as soon as the scroll starts", () => {
      render(<Slider items={items} />);
      mockHeights([50, 80, 120, 300]);
      mockLayout();
      const track = getTrack();
      track.scrollTo = vi.fn() as typeof track.scrollTo;

      fireEvent.keyDown(track, { key: "End" });
      expect(track.style.getPropertyValue("--ds-slider-height")).toBe("300px");
    });

    it("updates when a slide is resized and stops observing once unmounted", () => {
      let onResize = () => {};
      const observe = vi.fn();
      const disconnect = vi.fn();
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            onResize = callback;
          }
          observe = observe;
          disconnect = disconnect;
        },
      );

      const { unmount } = render(<Slider items={items} />);
      mockHeights([50, 80, 120, 300]);
      mockLayout();
      expect(observe).toHaveBeenCalledTimes(items.length);

      mockHeights([50, 80, 200, 300]);
      act(onResize);
      expect(getTrack().style.getPropertyValue("--ds-slider-height")).toBe("200px");

      unmount();
      expect(disconnect).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });

  describe("mouse drag", () => {
    const pointer = (clientX: number, pointerType = "mouse", button = 0) => ({
      clientX,
      pointerType,
      button,
      pointerId: 1,
    });

    it("scrolls with the mouse while dragging, then snaps to the next slide", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();
      const track = getTrack();

      fireEvent.pointerDown(screen.getByText("One"), pointer(300));
      fireEvent.pointerMove(track, pointer(295));
      expect(track).not.toHaveClass("ds-slider__track--dragging");

      fireEvent.pointerMove(track, pointer(240));
      expect(track).toHaveClass("ds-slider__track--dragging");
      expect(track.scrollLeft).toBe(60);

      fireEvent.pointerMove(track, pointer(220));
      expect(track.scrollLeft).toBe(80);

      fireEvent.pointerUp(track, pointer(220));
      expect(track).not.toHaveClass("ds-slider__track--dragging");
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 100 });
    });

    it("snaps to the previous slide when dragging backward", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();
      const track = getTrack();
      track.scrollLeft = 250;

      fireEvent.pointerDown(track, pointer(100));
      fireEvent.pointerMove(track, pointer(130));
      fireEvent.pointerCancel(track, pointer(130));

      expect(scrollTo).toHaveBeenLastCalledWith({ left: 200 });
    });

    it("snaps to the last slide when dragging forward past the last snap point", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();
      const track = getTrack();

      fireEvent.pointerDown(track, pointer(500));
      fireEvent.pointerMove(track, pointer(100));
      fireEvent.pointerUp(track, pointer(100));

      expect(scrollTo).toHaveBeenLastCalledWith({ left: 300 });
    });

    it("prevents the click that ends a drag, but not the next ones", () => {
      vi.useFakeTimers();
      const onClick = vi.fn();
      render(
        <Slider
          items={[
            <button key="cta" type="button" onClick={onClick}>
              Open
            </button>,
            ...items,
          ]}
        />,
      );
      mockLayout();
      const button = screen.getByRole("button", { name: "Open" });

      fireEvent.pointerDown(button, pointer(300));
      fireEvent.pointerMove(button, pointer(200));
      fireEvent.pointerUp(button, pointer(200));
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();

      vi.runAllTimers();
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it("ignores touch, other mouse buttons, the arrows and simple clicks", () => {
      render(<Slider items={items} />);
      const scrollTo = mockLayout();
      const track = getTrack();

      fireEvent.pointerDown(track, pointer(300, "touch"));
      fireEvent.pointerMove(track, pointer(100, "touch"));
      fireEvent.pointerDown(track, pointer(300, "mouse", 2));
      fireEvent.pointerMove(track, pointer(100));
      fireEvent.pointerDown(screen.getByTitle("Next slide"), pointer(300));
      fireEvent.pointerMove(track, pointer(100));
      fireEvent.pointerDown(track, pointer(300));
      fireEvent.pointerUp(track, pointer(300));

      expect(track.scrollLeft).toBe(0);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("prevents the native drag of images and links", () => {
      render(<Slider items={items} />);
      const event = createEvent.dragStart(screen.getByText("One"));

      fireEvent(screen.getByText("One"), event);
      expect(event.defaultPrevented).toBe(true);
    });

    it("does not recenter a loop while dragging", () => {
      vi.useFakeTimers();
      render(<Slider items={items} loop />);
      const scrollTo = mockLayout();
      const track = getTrack();

      fireEvent.pointerDown(track, pointer(300));
      fireEvent.pointerMove(track, pointer(250));
      vi.advanceTimersByTime(150);
      expect(scrollTo).not.toHaveBeenCalledWith(expect.objectContaining({ behavior: "instant" }));

      fireEvent.pointerUp(track, pointer(250));
      vi.useRealTimers();
    });
  });

  describe("labels", () => {
    it("uses the custom accessible labels", () => {
      render(
        <Slider
          items={items}
          dots
          autoPlay={5000}
          prevLabel="Précédent"
          nextLabel="Suivant"
          pauseLabel="Arrêter le défilement"
          dotLabel="Aller à la diapositive"
        />,
      );

      expect(screen.getByTitle("Précédent")).toBeInTheDocument();
      expect(screen.getByTitle("Suivant")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Arrêter le défilement" })).toBeInTheDocument();
      screen.getAllByRole("tab").forEach((tab) => expect(tab).toHaveAccessibleName("Aller à la diapositive"));
    });

    it("uses the custom play label once stopped", async () => {
      render(<Slider items={items} autoPlay={5000} playLabel="Lancer le défilement" />);

      await userEvent.click(screen.getByRole("button", { name: "Stop automatic slide show" }));
      expect(screen.getByRole("button", { name: "Lancer le défilement" })).toBeInTheDocument();
    });
  });

  it("updates on window resize and stops listening once unmounted", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Slider items={items} dots />);
    mockLayout();
    getTrack().scrollLeft = 300;

    fireEvent(window, new Event("resize"));
    expect(screen.getAllByRole("tab")[3]).toHaveAttribute("aria-selected", "true");

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
