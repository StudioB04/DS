import type { AnchorHTMLAttributes } from "react";

export interface SkipLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  label: string;
  anchor: `#${string}`;
}
