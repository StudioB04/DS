import type { ElementType } from "react";
import clsx from "clsx";
import type { LinkProps } from "./Link.types";
import Icon from "$uikit/Icon/Icon";
import Markdown from "$uikit/Markdown/Markdown";

import "./Link.css";

export default function Link({
  label,
  type = "button",
  variant = "primary",
  href,
  disabled,
  external,
  iconStart,
  iconEnd,
  className,
  ...restProps
}: LinkProps) {
  const LinkComponent = (href ? "a" : "button") as ElementType;

  return (
    <LinkComponent
      className={clsx("ds-link", `ds-link--variant-${variant}`, disabled && "ds-link--disabled", className)}
      type={!href && type ? type : undefined}
      href={href}
      target={href && external ? "_blank" : undefined}
      rel={href && external ? "noopener noreferrer" : undefined}
      disabled={disabled}
      {...restProps}
    >
      <>
        {iconStart && <Icon className="ds-link__icon ds-link__icon--start" src={iconStart} />}

        <Markdown allowTags={["strong", "em", "br"]}>{label}</Markdown>

        {href && external && !iconEnd && <Icon className="ds-link__icon ds-link__icon--external" src="external-link" />}

        {iconEnd && <Icon className="ds-link__icon ds-link__icon--end" src={iconEnd} />}
      </>
    </LinkComponent>
  );
}
