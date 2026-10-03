import clsx from "clsx";
import type { SkipLinkProps } from "./SkipLink.types";

import "./SkipLink.css";

export default function SkipLink({ label, anchor, className, ...restProps }: SkipLinkProps) {
  return (
    <a href={anchor} className={clsx("ds-skip-link", className)} {...restProps}>
      {label}
    </a>
  );
}
