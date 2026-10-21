"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ElementType } from "react";
import clsx from "clsx";
import Icon from "$uikit/Icon/Icon";
import type { BreadcrumbItem, BreadcrumbProps } from "./Breadcrumb.types";
import { getEllipsisTarget, getHiddenRange } from "./Breadcrumb.utils";
import type { BreadcrumbEntry, BreadcrumbMeasure } from "./Breadcrumb.utils";

import "./Breadcrumb.css";

export default function Breadcrumb({
  items,
  currentPageLabel,
  homeAsIcon = false,
  divider = "chevron-right",
  "aria-label": ariaLabel = "Breadcrumb",
  className,
  ...restProps
}: BreadcrumbProps) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [measure, setMeasure] = useState<BreadcrumbMeasure | null>(null);
  const [available, setAvailable] = useState(0);

  const trail: BreadcrumbItem[] = [...items, { label: currentPageLabel }];
  const signature = [divider, homeAsIcon, ...trail.map((item) => `${item.label}|${item.href ?? ""}`)].join();
  const isMeasuring = measure?.signature !== signature;
  const hiddenRange = measure && !isMeasuring ? getHiddenRange(measure, available) : null;

  useLayoutEffect(() => {
    const nav = navRef.current as HTMLElement;

    setAvailable(nav.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(() => setAvailable(nav.getBoundingClientRect().width));
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!isMeasuring || !list) return;

    const widths = Array.from(list.children, (child) => child.getBoundingClientRect().width);
    setMeasure({
      signature,
      entries: widths.slice(0, trail.length),
      ellipsis: widths[trail.length],
      gap: parseFloat(getComputedStyle(list).columnGap) || 0,
    });
  }, [isMeasuring, signature, trail.length]);

  useEffect(() => {
    if (!("fonts" in document)) {
      return undefined;
    }

    let isActive = true;

    void document.fonts.ready.then(() => {
      if (isActive) setMeasure(null);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const entries: BreadcrumbEntry[] = trail.flatMap<BreadcrumbEntry>((item, index) => {
    if (hiddenRange && index >= hiddenRange[0] && index < hiddenRange[1]) {
      if (index > hiddenRange[0]) return [];

      const target = getEllipsisTarget(trail, hiddenRange);
      return [{ key: "ellipsis", href: target.href, ariaLabel: target.label, text: "…", isEllipsis: true }];
    }

    const isHome = homeAsIcon && index === 0 && items.length > 0;

    return [
      {
        key: `${item.label}-${item.href ?? ""}`,
        href: item.href,
        ariaLabel: isHome ? item.label : undefined,
        text: isHome ? undefined : item.label,
        slot: isHome ? <Icon src="house" /> : item.slotStart,
        isCurrent: index === items.length,
      },
    ];
  });

  if (isMeasuring) {
    entries.push({ key: "measure", text: "…", isEllipsis: true, isMeasure: true });
  }

  return (
    <nav ref={navRef} aria-label={ariaLabel} className={clsx("ds-breadcrumb", className)} {...restProps}>
      <ol ref={listRef} className="ds-breadcrumb__list">
        {entries.map(({ key, href, ariaLabel, text, slot, isCurrent, isEllipsis, isMeasure }, position) => {
          const Tag = (href ? "a" : "span") as ElementType;

          return (
            <li
              key={key}
              className={clsx("ds-breadcrumb__entry", isMeasure && "ds-breadcrumb__entry--measure")}
              aria-hidden={isMeasure ? true : undefined}
            >
              {position > 0 && <Icon src={divider} className="ds-breadcrumb__divider" size={16} aria-hidden="true" />}

              <Tag
                href={href}
                className={clsx(
                  "ds-breadcrumb__item",
                  isEllipsis && "ds-breadcrumb__ellipsis",
                  isCurrent && "ds-breadcrumb__item--current",
                )}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={ariaLabel ?? text}
                title={ariaLabel ?? text}
                role={isEllipsis && !href ? "img" : undefined}
              >
                {slot && <span className="ds-breadcrumb__slot">{slot}</span>}
                {text && (
                  <span className="ds-breadcrumb__label" aria-hidden={isEllipsis ? true : undefined}>
                    {text}
                  </span>
                )}
              </Tag>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
