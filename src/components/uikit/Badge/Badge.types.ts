import type { Variant, Size } from "$/types";
import type { LucideIconName } from "$uikit/types";
import type { HTMLAttributes } from "react";

type BadgeType = "plain" | "light" | "clear";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: Variant;
  type?: BadgeType;
  shape?: "square" | "pill";
  size?: Size;
  iconEnd?: LucideIconName;
  iconStart?: LucideIconName;
  iconOnly?: LucideIconName;
}
