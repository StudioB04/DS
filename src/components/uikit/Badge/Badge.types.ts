import type { BadgeColorVariant, Size } from "$/types";
import type { LucideIconName } from "$uikit/types";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: BadgeColorVariant;
  type: "plain" | "light";
  size?: Size;
  iconEnd?: LucideIconName;
  iconStart?: LucideIconName;
  iconOnly?: LucideIconName;
}
