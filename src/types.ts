import type { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export type ButtonOrLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & LinkHTMLAttributes<HTMLLinkElement>;

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type ButtonColorVariants = "primary" | "secondary" | "tertiary" | "success" | "error" | "warning" | "info";
