import type { ButtonColorVariant, ButtonOrLinkProps } from "$/types";
import type { IconProps } from "$uikit/types";

export interface LinkProps extends ButtonOrLinkProps {
  label: string;
  variant?: ButtonColorVariant;
  external?: boolean;
  disabled?: boolean;
  iconStart?: IconProps["name"];
  iconEnd?: IconProps["name"];
}
