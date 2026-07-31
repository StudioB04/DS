import type { Variant, ButtonOrLinkProps, Shape, Size } from "$/types";
import type { IconProps } from "$uikit/types";
import type { ReactNode } from "react";

export interface ButtonProps extends ButtonOrLinkProps {
  label: string;
  size?: Size;
  shape?: Shape;
  variant?: Variant;
  external?: boolean;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  iconStart?: IconProps["name"];
  iconEnd?: IconProps["name"];
  iconOnly?: IconProps["name"];
  slotStart?: ReactNode;
  slotEnd?: ReactNode;
}
