import type { ButtonOrLinkProps, Variant } from "$/types";
import type { IconProps } from "$uikit/types";

export interface LinkProps extends ButtonOrLinkProps {
  label: string;
  variant?: Variant;
  external?: boolean;
  disabled?: boolean;
  iconStart?: IconProps["name"];
  iconEnd?: IconProps["name"];
}
