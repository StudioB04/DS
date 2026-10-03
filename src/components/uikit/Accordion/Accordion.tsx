import clsx from "clsx";
import Icon from "$uikit/Icon/Icon";
import Markdown from "$uikit/Markdown/Markdown";
import type { AccordionProps } from "./Accordion.types";

import "./Accordion.css";

export default function Accordion({
  label,
  name,
  children,
  size = "md",
  slotStart,
  slotEnd,
  className,
  ...restProps
}: AccordionProps) {
  return (
    <details className={clsx("ds-accordion", `ds-accordion--size-${size}`, className)} name={name} {...restProps}>
      <summary className="ds-accordion__summary">
        {slotStart && <span className="ds-accordion__slot ds-accordion__slot--start">{slotStart}</span>}

        <Markdown allowTags={["strong", "em", "br"]} className="ds-accordion__label">
          {label}
        </Markdown>

        {slotEnd && <span className="ds-accordion__slot ds-accordion__slot--end">{slotEnd}</span>}

        <Icon src="chevron-down" className="ds-accordion__chevron" />
      </summary>

      <div className="ds-accordion__content">{children}</div>
    </details>
  );
}
