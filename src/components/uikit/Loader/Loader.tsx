// https://magecdn.com/tools/svg-loaders
import { lazy, Suspense } from "react";
import clsx from "clsx";
import { camelCase } from "@/utils";
import type { LoaderProps } from "./Loader.types";

import "./Loader.css";

const Loader = ({ name = "spinning-dots", className, ...restProps }: LoaderProps) => {
  const LoaderInner = lazy(() => import(`./loaders/${camelCase(name)}`));

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

export default Loader;
