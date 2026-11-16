import type { RefObject } from "react";
import { useEffect } from "react";

export default function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (event: MouseEvent) => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
