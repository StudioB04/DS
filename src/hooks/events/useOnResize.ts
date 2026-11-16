import { useEffect } from "react";
import { debounce } from "$utils";

export default function useOnResize(callback: () => void) {
  useEffect(() => {
    const onResize = debounce(callback, 100);
    globalThis.addEventListener("resize", onResize);

    return () => {
      globalThis.removeEventListener("resize", onResize);
      onResize.cancel();
    };
  }, [callback]);
}
