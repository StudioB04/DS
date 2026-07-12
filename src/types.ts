import type { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export type ButtonOrLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & LinkHTMLAttributes<HTMLLinkElement>;

export enum Size {
  xxs = "xxs",
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  xxl = "xxl",
}

export enum ButtonColorVariant {
  primary = "primary",
  secondary = "secondary",
  tertiary = "tertiary",
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
}
