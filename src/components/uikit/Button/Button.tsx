import { Icon, Markdown } from "$uikit";
import clsx from "clsx";
import type { ButtonProps } from "./Button.types";
import type { ElementType } from "react";
import { ButtonColorVariant, Size } from "$/types";

import "./Button.css";

const Button = ({
  label,
  type = "button",
  shape = "square",
  size = Size.md,
  variant = ButtonColorVariant.primary,
  href,
  external,
  loading,
  disabled,
  block,
  iconStart,
  iconEnd,
  iconOnly,
  slotStart,
  slotEnd,
  className,
  title,
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
      title={title ?? label}
      {...restProps}
    >
      {slotStart && <span className="ds-button__slot ds-button__slot--start">{slotStart}</span>}

      {iconOnly ? (
        <Icon src={iconOnly} className="ds-button__icon ds-button__icon--only" />
      ) : (
        <>
          {iconStart && <Icon className="ds-button__icon ds-button__icon--start" src={iconStart} />}

          <Markdown allowTags={["strong", "em", "br"]}>{label}</Markdown>

          {iconEnd && <Icon className="ds-button__icon ds-button__icon--end" src={iconEnd} />}
        </>
      )}

      {slotEnd && <span className="ds-button__slot ds-button__slot--end">{slotEnd}</span>}
    </ButtonComponent>
  );
};

export default Button;
