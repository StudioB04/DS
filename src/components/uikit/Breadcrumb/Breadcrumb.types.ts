import type { HTMLAttributes, ReactNode } from "react";
import type { IconProps } from "$uikit/Icon/Icon.types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  slotStart?: ReactNode;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  currentPageLabel: string;
  homeAsIcon?: boolean;
  divider?: IconProps["src"];
}
