import clsx from "clsx";
import type { DividerProps } from "./Divider.types";

import "./Divider.css";

export default function Divider({
  variant = "primary",
  size = "md",
  vertical = false,
  className,
  ...restProps
}: DividerProps) {
  return (
    <div
      className={clsx(
        "ds-divider",
        `ds-divider--size-${size}`,
        `ds-divider--variant-${variant}`,
        vertical && "ds-divider--vertical",
        className,
      )}
      aria-hidden="true"
      {...restProps}
    />
  );
}
