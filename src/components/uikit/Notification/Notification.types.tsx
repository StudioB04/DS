import type { Variant, Size } from "$/types";
import type { HTMLAttributes } from "react";

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: Size;
  max?: number;
  variant?: Variant;
}
