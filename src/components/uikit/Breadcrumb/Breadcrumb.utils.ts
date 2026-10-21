import type { ReactNode } from "react";
import type { BreadcrumbItem } from "./Breadcrumb.types";

export interface BreadcrumbEntry {
  key: string;
  href?: string;
  ariaLabel?: string;
  text?: string;
  slot?: ReactNode;
  isCurrent?: boolean;
  isEllipsis?: boolean;
  isMeasure?: boolean;
}

export interface BreadcrumbMeasure {
  signature: string;
  entries: number[];
  ellipsis: number;
  gap: number;
}

export function getHiddenRange(measure: BreadcrumbMeasure, available: number): [number, number] | null {
  const { entries, ellipsis, gap } = measure;
  const count = entries.length;
  const total = entries.reduce((sum, width) => sum + width, 0) + gap * (count - 1);

  if (count < 3 || available <= 0 || total <= available) return null;

  let used = entries[0] + gap + ellipsis + gap + entries[count - 1];
  let start = count - 1;

  while (start > 1 && used + gap + entries[start - 1] <= available) {
    used += gap + entries[start - 1];
    start -= 1;
  }

  return [1, start];
}

export function getEllipsisTarget(items: BreadcrumbItem[], [start, end]: [number, number]): BreadcrumbItem {
  const hidden = items.slice(start, end).reverse();

  return hidden.find((item) => item.href) ?? hidden[0];
}
