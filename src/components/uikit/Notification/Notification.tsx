import clsx from "clsx";
import type { NotificationProps } from "./Notification.types";

import "./Notification.css";

export default function Notification({
  value = 0,
  size = "md",
  variant = "red",
  max = 99,
  className,
  ...restProps
}: NotificationProps) {
  return (
    <span
      className={clsx(
        "ds-notification",
        `ds-notification--size-${size}`,
        `ds-notification--variant-${variant}`,
        className,
      )}
      title={restProps.title ?? String(value)}
      {...restProps}
    >
      {value > max ? `${max}+` : value}
    </span>
  );
}
