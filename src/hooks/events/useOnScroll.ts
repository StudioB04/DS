import type { RefObject } from "react";
import { useEffect } from "react";

export default function useOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null> | Window = window,
  callback: () => void,
) {
  useEffect(() => {
    const target = "current" in ref ? ref.current : window;

    target?.addEventListener("scroll", callback);

    return () => {
      target?.removeEventListener("scroll", callback);
    };
  }, [ref, callback]);
}
