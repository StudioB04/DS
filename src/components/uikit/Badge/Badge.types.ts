import type { BadgeColorVariant, Shape, Size } from "$/types";
import type { LucideIconName } from "$uikit/types";
import type { HTMLAttributes } from "react";

type BadgeType = "plain" | "light";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: BadgeColorVariant;
  type?: BadgeType;
  shape?: Shape;
  size?: Size;
  iconEnd?: LucideIconName;
  iconStart?: LucideIconName;
  iconOnly?: LucideIconName;
}
