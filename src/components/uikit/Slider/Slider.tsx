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


const isRtlTrack = (track: HTMLElement) => getComputedStyle(track).direction === "rtl";

const getSlideStart = (track: HTMLElement, slide: HTMLElement) =>
  isRtlTrack(track) ? track.clientWidth - slide.offsetLeft - slide.offsetWidth : slide.offsetLeft;

const getScrollPosition = (track: HTMLElement) => (isRtlTrack(track) ? -track.scrollLeft : track.scrollLeft);

const scrollTrackTo = (track: HTMLElement, position: number, behavior?: ScrollBehavior) =>
  track.scrollTo?.({ left: isRtlTrack(track) ? -position : position, ...(behavior && { behavior }) });

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
  slideLabel = "{index} of {total}",
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
  const targetTimer = useRef(0);
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
  const isRtl = () => isRtlTrack(getTrack());
  const startOf = (slide: HTMLElement) => getSlideStart(getTrack(), slide);
  const getPosition = () => getScrollPosition(getTrack());
  const scrollToPosition = (position: number, behavior?: ScrollBehavior) =>
    scrollTrackTo(getTrack(), position, behavior);

  const getClosest = () => {
    const position = getPosition();
    const slides = getSlides();
    const distance = (slide: HTMLElement) => Math.abs(startOf(slide) - position);

    return slides.reduce((closest, slide, i) => (distance(slide) < distance(slides[closest]) ? i : closest), 0);
  };

  const recenter = () => {
    if (drag.current?.moved) return;

    const slides = getSlides();
    const closest = getClosest();
    const setWidth = startOf(slides[total]) - startOf(slides[0]);

    if (closest < total) scrollToPosition(getPosition() + setWidth, "instant");
    if (closest >= 2 * total) scrollToPosition(getPosition() - setWidth, "instant");
  };

  const syncView = (position: number) => {
    const { clientWidth, scrollWidth } = getTrack();
    const heights = getSlides()
      .filter(
        (slide) => startOf(slide) + slide.offsetWidth > position + 1 && startOf(slide) < position + clientWidth - 1,
      )
      .map((slide) => (slide.firstElementChild as HTMLElement).offsetHeight);

    setAtStart(position <= 1);
    setAtEnd(position + clientWidth >= scrollWidth - 1);
    setHeight(heights.length > 0 ? Math.max(...heights) : undefined);
  };

  const update = () => {
    const { clientWidth, scrollWidth } = getTrack();
    const position = getPosition();
    const target = scrollTarget.current;

    window.clearTimeout(targetTimer.current);
    if (target === null || Math.abs(position - target) <= 1) {
      scrollTarget.current = null;
      syncView(position);
    } else {
      targetTimer.current = window.setTimeout(() => {
        scrollTarget.current = null;
        syncView(getPosition());
      }, SETTLE_DELAY);
    }

    if (loop) {
      setIndex((getClosest() - total + total * 3) % total);
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(recenter, SETTLE_DELAY);
      return;
    }

    const isAtEnd = position > 1 && position + clientWidth >= scrollWidth - 1;
    setIndex(isAtEnd ? total - 1 : getClosest());
  };

  const updateRef = useRef(update);
  updateRef.current = update;
  const handleScroll = useCallback(() => updateRef.current(), []);

  useEffect(() => {
    const track = trackRef.current as HTMLUListElement;
    const firstSlide = track.children[offset] as HTMLElement | undefined;

    if (loop && firstSlide) scrollTrackTo(track, getSlideStart(track, firstSlide), "instant");
    handleScroll();
  }, [loop, offset, handleScroll]);

  useEffect(
    () => () => {
      window.clearTimeout(settleTimer.current);
      window.clearTimeout(targetTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const track = trackRef.current as HTMLUListElement;
    const observer = new ResizeObserver(handleScroll);
    observer.observe(track);
    Array.from(track.children).forEach((slide) => observer.observe(slide.firstElementChild as Element));

    return () => observer.disconnect();
  }, [total, loop, handleScroll]);

  const goTo = (target: number) => {
    const slide = getSlides()[target];
    if (!slide) return;

    const { scrollWidth, clientWidth } = getTrack();
    const position = Math.min(startOf(slide), scrollWidth - clientWidth);
    scrollTarget.current = position;
    syncView(position);
    scrollToPosition(startOf(slide));
  };

  const isPreviousDisabled = !loop && atStart;
  const isNextDisabled = !loop && atEnd;
  const getCurrent = () => (loop ? getClosest() : index);

  const next = () => {
    if (isNextDisabled) return;

    const { clientWidth } = getTrack();
    const position = getPosition();
    const current = getCurrent();
    const target = slidePerPage
      ? getSlides().findIndex((slide) => startOf(slide) + slide.offsetWidth > position + clientWidth + 1)
      : current + 1;
    goTo(Math.max(target, current + 1));
  };

  const previous = () => {
    if (isPreviousDisabled) return;

    const { clientWidth } = getTrack();
    const position = getPosition();
    const current = getCurrent();
    const target = slidePerPage
      ? getSlides().findIndex((slide) => startOf(slide) >= position - clientWidth - 1)
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).matches("input, textarea, select, [contenteditable]")) return;

    const rtl = isRtl();
    const actions: Record<string, () => void> = {
      ArrowLeft: rtl ? next : previous,
      ArrowRight: rtl ? previous : next,
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
      track.classList.add("ds-slider__track--dragging");
      track.setPointerCapture?.(event.pointerId);
    }
    track.scrollLeft = drag.current.scrollLeft - distance;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    drag.current = null;
    if (!current?.moved) return;

    const position = getPosition();
    const slides = getSlides();
    const isForward = isRtl() ? event.clientX > current.x : event.clientX < current.x;
    const ahead = slides.findIndex((slide) => startOf(slide) > position + 1);
    const behind = slides.reduce((last, slide, i) => (startOf(slide) < position - 1 ? i : last), 0);

    getTrack().classList.remove("ds-slider__track--dragging");
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
  const getSlideLabel = (i: number) => slideLabel.replace("{index}", String(i + 1)).replace("{total}", String(total));

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
            aria-label={isPlaying ? pauseLabel : playLabel}
            title={isPlaying ? pauseLabel : playLabel}
          >
            <Icon src={isPlaying ? "pause" : "play"} size={16} />
          </button>
        )}

        <div
          className="ds-slider__viewport"
          onKeyDown={handleKeyDown}
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
            onScroll={handleScroll}
          >
            {loop && renderClones()}
            {Children.map(items, (item, i) => (
              <li className="ds-slider__slide">
                <div
                  id={slideId(i)}
                  role={dots ? "tabpanel" : "group"}
                  aria-roledescription="slide"
                  aria-label={getSlideLabel(i)}
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

        <div className="ds-slider__status" aria-live={isRotating ? "off" : "polite"} aria-atomic="true">
          {getSlideLabel(index)}
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
            onKeyDown={handleKeyDown}
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
