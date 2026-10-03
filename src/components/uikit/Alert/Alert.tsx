import { useState } from "react";
import type { MouseEvent } from "react";
import clsx from "clsx";
import Icon from "$uikit/Icon/Icon";
import Markdown from "$uikit/Markdown/Markdown";
import type { AlertProps } from "./Alert.types";

import "./Alert.css";

export default function Alert({
  title,
  children,
  variant = "neutral",
  persistant = false,
  titleSlotStart,
  titleSlotEnd,
  closeLabel = "Close",
  onClose,
  className,
  ...restProps
}: AlertProps) {
  const [status, setStatus] = useState<"open" | "closed">("open");

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    if (status !== "open") return;
    setStatus("closed");
    onClose?.(event);
  };

  return (
    status === "open" && (
      <div
        role="alert"
        className={clsx("ds-alert", `ds-alert--variant-${variant}`, persistant && "ds-alert--persistant", className)}
        {...restProps}
      >
        <div className="ds-alert__header">
          {titleSlotStart && <span className="ds-alert__slot ds-alert__slot--title-start">{titleSlotStart}</span>}

          <Markdown allowTags={["strong", "em", "br"]} className="ds-alert__title">
            {title}
          </Markdown>

          {titleSlotEnd && <span className="ds-alert__slot ds-alert__slot--title-end">{titleSlotEnd}</span>}

          {!persistant && (
            <button
              type="button"
              className="ds-alert__close"
              aria-label={closeLabel}
              title={closeLabel}
              onClick={handleClose}
            >
              <Icon src="x" size={20} className="ds-alert__close-icon" />
            </button>
          )}
        </div>

        {children && <div className="ds-alert__content">{children}</div>}
      </div>
    )
  );
}
