import clsx from "clsx";
import type { LoaderProps } from "./Loader.types";

import "./Loader.css";

export default function Loader({ label, className, ...restProps }: LoaderProps) {
  return (
    <dialog className={clsx("ds-loader", className)} {...restProps}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="ds-loader__svg">
        <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.75s"
            values="0 12 12;360 12 12"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      {label && <p className="ds-loader__label">{label}</p>}
    </dialog>
  );
}
