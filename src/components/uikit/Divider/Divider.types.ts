import type { Size } from "$/types";
import type { HTMLAttributes } from "react";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: Size | '0' | 0;
  vertical?: boolean;
}
