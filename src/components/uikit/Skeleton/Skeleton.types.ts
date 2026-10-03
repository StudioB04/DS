import type { HTMLAttributes } from "react";


export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: string;
  type?: "block" | "round" | "text";
}
