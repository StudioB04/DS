import clsx from "clsx";
import type { BadgeProps } from "./Badge.types";
import { Icon, Markdown } from "$uikit";

import "./Badge.css";

export default function Badge({
  label,
  variant = "neutral",
  size = "md",
  type = "light",
  iconEnd,
  iconStart,
  iconOnly,
}: BadgeProps) {
  return (
    <span
      className={clsx("ds-badge", `ds-badge--size-${size}`, `ds-badge--type-${type}`, `ds-badge--variant-${variant}`)}
    >
      {iconOnly ? (
        <Icon src={iconOnly} className="ds-badge__icon ds-badge__icon--only" />
      ) : (
        <>
          {iconStart && <Icon src={iconStart} className="ds-badge__icon ds-badge__icon--start" />}
          <Markdown className="ds-badge__label">{label}</Markdown>
          {iconEnd && <Icon src={iconEnd} className="ds-badge__icon ds-badge__icon--end" />}
        </>
      )}
    </span>
  );
}
