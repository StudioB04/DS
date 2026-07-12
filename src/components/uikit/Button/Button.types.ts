import type { ButtonColorVariant, ButtonOrLinkProps, Size } from "$/types";
import type { IconProps } from "$uikit/types";
import type { ReactNode } from "react";

export interface ButtonProps extends ButtonOrLinkProps {
  label: string;
  size?: Size;
  shape?: "pill" | "square";
  variant?: ButtonColorVariant;
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
