import type { HTMLAttributes } from "react";

export interface LogoProps extends HTMLAttributes<HTMLOrSVGElement> {
  variant?: "brand" | "alt" | "inverse" | "default";
  type?: "small" | "full";
}
