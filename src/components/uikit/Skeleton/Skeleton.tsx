import clsx from "clsx";
import type { CSSProperties } from "react";
import type { SkeletonProps } from "./Skeleton.types";

import "./Skeleton.css";

export default function Skeleton({ height, type = "block", className, style, ...restProps }: SkeletonProps) {
  return (
    <div
      className={clsx("ds-skeleton", `ds-skeleton--type-${type}`, className)}
      style={{ "--ds-skeleton-height": height, ...style } as CSSProperties}
      aria-hidden="true"
      {...restProps}
    />
  );
}
