import { Markdown } from "$uikit";
import clsx from "clsx";
import type { ButtonProps } from "./Button.types";
import type { ElementType } from "react";

export default ({
  label,
  type = "button",
  size,
  href,
  external,
  loading,
  disabled,
  shape,
  block,
  variant,
  slotStart,
  slotEnd,
  className,
  ...restProps
}: ButtonProps) => {
  const ButtonComponent = (href ? "a" : "button") as ElementType;

  return (
    <ButtonComponent
      className={clsx(
        "ds-button",
        `ds-button--shape-${shape}`,
        `ds-button--size-${size}`,
        `ds-button--variant-${variant}`,
        block && "ds-button--block",
        loading && "ds-button--loading",
        disabled && "ds-button--disabled",
        className,
      )}
      disabled={!href ? disabled === true || loading === true : undefined}
      type={!href && type ? type : undefined}
      href={href}
      target={href && external ? "_blank" : undefined}
      rel={href && external ? "noopener noreferrer" : undefined}
      {...restProps}
    >
      {slotStart && <span className="ds-button__slot ds-button__slot--start">{slotStart}</span>}

      <Markdown allowTags={["strong", "em", "br"]}>{label}</Markdown>

      {slotEnd && <span className="ds-button__slot ds-button__slot--end">{slotEnd}</span>}
    </ButtonComponent>
  );
};
