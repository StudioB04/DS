// https://magecdn.com/tools/svg-loaders
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import clsx from "clsx";
import type { LoaderName, LoaderProps } from "./Loader.types";

import "./Loader.css";

const loaderLoaders: Record<LoaderName, () => Promise<{ default: ComponentType }>> = {
  "spinning-dots": () => import("./loaders/SpinningDots"),
  "bouncing-dots": () => import("./loaders/BouncingDots"),
  ring: () => import("./loaders/Ring"),
  clock: () => import("./loaders/Clock"),
  pulse: () => import("./loaders/Pulse"),
};

export default ({ name = "spinning-dots", className, ...restProps }: LoaderProps) => {
  const LoaderInner = lazy(loaderLoaders[name]);

  return (
    <dialog className={clsx("ds-loader", `ds-loader--${name}`, className)} {...restProps} key={name}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="ds-loader__svg">
        <Suspense fallback={null}>
          <LoaderInner />
        </Suspense>
      </svg>
    </dialog>
  );
};
