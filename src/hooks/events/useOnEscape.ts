import { useEffect } from "react";

export default function useOnEscape(callback: () => void) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        callback();
        (event?.target as HTMLButtonElement)?.blur();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [callback]);
}
