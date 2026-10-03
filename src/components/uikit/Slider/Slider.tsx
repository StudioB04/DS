"use client";

import { Children, useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import clsx from "clsx";
import Button from "$uikit/Button/Button";
import Icon from "$uikit/Icon/Icon";
import type { SliderProps } from "./Slider.types";

import "./Slider.css";

const SETTLE_DELAY = 150;
const DRAG_THRESHOLD = 10;
const DRAGGING_CLASS = "ds-slider__track--dragging";

const isFormField = (element: HTMLElement) => element.matches("input, textarea, select, [contenteditable]");

export default function Slider({
  items,
  arrows = true,
  dots = false,
  autoPlay = 0,
  slidePerPage = false,
  loop = false,
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
  playLabel = "Start automatic slide show",
  pauseLabel = "Stop automatic slide show",
  dotLabel = "Go to slide",
  className,
  style,
  ...restProps
}: SliderProps) {
  const id = useId();
  const total = items.length;
  const hasAutoPlay = autoPlay > 0;
  const offset = loop ? total : 0;

  const trackRef = useRef<HTMLUListElement>(null);
  const isPointerDown = useRef(false);
  const settleTimer = useRef(0);
  const edgeTimer = useRef(0);
  const scrollTarget = useRef<number | null>(null);
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean } | null>(null);
  const preventClick = useRef(false);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [ignoreHover, setIgnoreHover] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [height, setHeight] = useState<number>();

  const isRotating = hasAutoPlay && isPlaying && (!isHovered || ignoreHover);

  const getTrack = () => trackRef.current as HTMLUListElement;
  const getSlides = () => Array.from(getTrack().children) as HTMLElement[];

  const getClosest = useCallback(() => {
    const track = trackRef.current as HTMLUListElement;
    const slides = Array.from(track.children) as HTMLElement[];
    const distance = (slide: HTMLElement) => Math.abs(slide.offsetLeft - track.scrollLeft);

    return slides.reduce((closest, slide, i) => (distance(slide) < distance(slides[closest]) ? i : closest), 0);
  }, []);

  const recenter = useCallback(() => {
    const track = trackRef.current as HTMLUListElement;
    const slides = Array.from(track.children) as HTMLElement[];
    if (drag.current?.moved) return;

    const closest = getClosest();
    const setWidth = slides[total].offsetLeft - slides[0].offsetLeft;

    if (closest < total) track.scrollTo?.({ left: track.scrollLeft + setWidth, behavior: "instant" });
    if (closest >= 2 * total) track.scrollTo?.({ left: track.scrollLeft - setWidth, behavior: "instant" });
  }, [getClosest, total]);

  const syncView = useCallback((left: number) => {
    const { clientWidth, scrollWidth, children } = trackRef.current as HTMLUListElement;
    const heights = (Array.from(children) as HTMLElement[])
      .filter((slide) => slide.offsetLeft + slide.offsetWidth > left + 1 && slide.offsetLeft < left + clientWidth - 1)
      .map((slide) => (slide.firstElementChild as HTMLElement).offsetHeight);

    setAtStart(left <= 1);
    setAtEnd(left + clientWidth >= scrollWidth - 1);
    setHeight(heights.length > 0 ? Math.max(...heights) : undefined);
  }, []);

  const update = useCallback(() => {
    const { scrollLeft, clientWidth, scrollWidth, children } = trackRef.current as HTMLUListElement;
    const target = scrollTarget.current;

    window.clearTimeout(edgeTimer.current);
    if (target === null || Math.abs(scrollLeft - target) <= 1) {
      scrollTarget.current = null;
      syncView(scrollLeft);
    } else {
      edgeTimer.current = window.setTimeout(() => {
        scrollTarget.current = null;
        syncView((trackRef.current as HTMLUListElement).scrollLeft);
      }, SETTLE_DELAY);
    }

    if (loop) {
      setIndex((getClosest() - total + total * 3) % total);
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(recenter, SETTLE_DELAY);
      return;
    }

    const isAtStart = scrollLeft <= 1;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
    setIndex(isAtEnd && !isAtStart ? children.length - 1 : getClosest());
  }, [loop, total, getClosest, recenter, syncView]);

  useEffect(() => {
    const track = trackRef.current as HTMLUListElement;
    const firstSlide = track.children[offset] as HTMLElement | undefined;

    if (loop && firstSlide) track.scrollTo?.({ left: firstSlide.offsetLeft, behavior: "instant" });
    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.clearTimeout(settleTimer.current);
      window.clearTimeout(edgeTimer.current);
    };
  }, [update, loop, offset]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const track = trackRef.current as HTMLUListElement;
    const observer = new ResizeObserver(() => syncView(scrollTarget.current ?? track.scrollLeft));
    Array.from(track.children).forEach((slide) => observer.observe(slide.firstElementChild as Element));

    return () => observer.disconnect();
  }, [items, syncView]);

  const goTo = (target: number) => {
    const slide = getSlides()[target];
    if (!slide) return;

    const track = getTrack();
    const left = Math.min(slide.offsetLeft, track.scrollWidth - track.clientWidth);
    scrollTarget.current = left;
    syncView(left);
    track.scrollTo?.({ left: slide.offsetLeft });
  };

  const isPreviousDisabled = !loop && atStart;
  const isNextDisabled = !loop && atEnd;
  const getCurrent = () => (loop ? getClosest() : index);

  const next = () => {
    if (isNextDisabled) return;

    const { scrollLeft, clientWidth } = getTrack();
    const current = getCurrent();
    const target = slidePerPage
      ? getSlides().findIndex((slide) => slide.offsetLeft + slide.offsetWidth > scrollLeft + clientWidth + 1)
      : current + 1;
    goTo(Math.max(target, current + 1));
  };

  const previous = () => {
    if (isPreviousDisabled) return;

    const { scrollLeft, clientWidth } = getTrack();
    const current = getCurrent();
    const target = slidePerPage
      ? getSlides().findIndex((slide) => slide.offsetLeft >= scrollLeft - clientWidth - 1)
      : current - 1;
    goTo(Math.min(target, current - 1));
  };

  const advance = () => {
    if (isNextDisabled) goTo(0);
    else next();
    setCycle((value) => value + 1);
  };

  const toggleRotation = () => {
    setIgnoreHover(!isPlaying);
    setIsPlaying(!isPlaying);
  };

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isFormField(event.target as HTMLElement)) return;

    const actions: Record<string, () => void> = {
      ArrowLeft: previous,
      ArrowRight: next,
      Home: () => goTo(offset),
      End: () => goTo(offset + total - 1),
    };
    const action = actions[event.key];
    if (!action) return;

    event.preventDefault();
    action();
  };

  const handleDotsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: previous,
      ArrowRight: next,
      Home: () => goTo(offset),
      End: () => goTo(offset + total - 1),
    };
    const action = actions[event.key];
    if (!action) return;

    event.preventDefault();
    action();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !getTrack().contains(event.target as Node)) return;
    drag.current = { x: event.clientX, scrollLeft: getTrack().scrollLeft, moved: false };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const track = getTrack();
    const distance = event.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(distance) < DRAG_THRESHOLD) return;

    if (!drag.current.moved) {
      drag.current.moved = true;
      track.classList.add(DRAGGING_CLASS);
      track.setPointerCapture?.(event.pointerId);
    }
    track.scrollLeft = drag.current.scrollLeft - distance;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    drag.current = null;
    if (!current?.moved) return;

    const track = getTrack();
    const { scrollLeft } = track;
    const slides = getSlides();
    const isForward = event.clientX < current.x;
    const ahead = slides.findIndex((slide) => slide.offsetLeft > scrollLeft + 1);
    const behind = slides.reduce((last, slide, i) => (slide.offsetLeft < scrollLeft - 1 ? i : last), 0);

    track.classList.remove(DRAGGING_CLASS);
    preventClick.current = true;
    window.setTimeout(() => (preventClick.current = false));
    goTo(isForward ? (ahead === -1 ? slides.length - 1 : ahead) : behind);
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!preventClick.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIgnoreHover(false);
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!isPointerDown.current && !event.currentTarget.contains(event.relatedTarget)) setIsPlaying(false);
  };

  const slideId = (i: number) => `${id}-slide-${i}`;
  const dotId = (i: number) => `${id}-dot-${i}`;

  const renderClones = () =>
    Children.map(items, (item) => (
      <li className="ds-slider__slide" aria-hidden="true" inert>
        <div className="ds-slider__slide-content">{item}</div>
      </li>
    ));

  return (
    <section
      aria-roledescription="carousel"
      className={clsx(
        "ds-slider",
        hasAutoPlay && !isRotating && "ds-slider--paused",
        (loop || !atStart) && "ds-slider--fade-start",
        (loop || !atEnd) && "ds-slider--fade-end",
        className,
      )}
      style={{ "--ds-slider-delay": `${autoPlay}ms`, ...style } as CSSProperties}
      {...restProps}
    >
      <div
        className="ds-slider__inner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onPointerDown={() => (isPointerDown.current = true)}
        onPointerUp={() => (isPointerDown.current = false)}
      >
        {hasAutoPlay && (
          <button
            type="button"
            className="ds-slider__play"
            onClick={toggleRotation}
            title={isPlaying ? pauseLabel : playLabel}
          >
            <Icon src={isPlaying ? "pause" : "play"} size={16} />
          </button>
        )}

        <div
          className="ds-slider__viewport"
          onKeyDown={handleViewportKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClickCapture={handleClickCapture}
          onDragStart={(event) => event.preventDefault()}
        >
          {arrows && (
            <Button
              label={prevLabel}
              iconOnly="chevron-left"
              variant="neutral"
              shape="pill"
              size="sm"
              className="ds-slider__arrow ds-slider__arrow--previous"
              aria-disabled={isPreviousDisabled}
              onClick={previous}
            />
          )}

          <ul
            ref={trackRef}
            role="list"
            className="ds-slider__track"
            style={height === undefined ? undefined : ({ "--ds-slider-height": `${height}px` } as CSSProperties)}
            tabIndex={0}
            aria-live={isRotating ? "off" : "polite"}
            aria-atomic="false"
            onScroll={update}
          >
            {loop && renderClones()}
            {Children.map(items, (item, i) => (
              <li className="ds-slider__slide">
                <div
                  id={slideId(i)}
                  role={dots ? "tabpanel" : "group"}
                  aria-roledescription="slide"
                  className="ds-slider__slide-content"
                >
                  {item}
                </div>
              </li>
            ))}
            {loop && renderClones()}
          </ul>

          {arrows && (
            <Button
              label={nextLabel}
              iconOnly="chevron-right"
              variant="neutral"
              shape="pill"
              size="sm"
              className="ds-slider__arrow ds-slider__arrow--next"
              aria-disabled={isNextDisabled}
              onClick={next}
            />
          )}
        </div>

        {hasAutoPlay && (
          <div className="ds-slider__progress" aria-hidden="true">
            <span key={cycle} className="ds-slider__progress-bar" onAnimationEnd={advance} />
          </div>
        )}

        {dots && (
          <div
            role="tablist"
            tabIndex={0}
            aria-activedescendant={dotId(index)}
            className="ds-slider__dots"
            onKeyDown={handleDotsKeyDown}
          >
            {Children.map(items, (_item, i) => (
              <button
                id={dotId(i)}
                type="button"
                role="tab"
                className="ds-slider__dot"
                aria-label={dotLabel}
                aria-selected={i === index}
                aria-controls={slideId(i)}
                tabIndex={-1}
                onClick={() => goTo(offset + i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
