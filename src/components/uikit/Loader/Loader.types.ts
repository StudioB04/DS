import type { HTMLAttributes } from "react";

export const LoaderNameMap = ["spinning-dots", "bouncing-dots", "ring", "clock", "pulse"] as const;
export type LoaderName = (typeof LoaderNameMap)[number];

export interface LoaderProps extends HTMLAttributes<HTMLDialogElement> {
  name?: LoaderName;
}
