import { useEffect, useRef } from "react";
import type { FocusTrapProps } from "./FocusTrap.types";
import { getInteractiveDomNodes } from "./FocusTrap.utils";

const FocusTrap = ({ children }: FocusTrapProps) => {
  const topAnchor = useRef<HTMLButtonElement>(null);
  const bottomAnchor = useRef<HTMLButtonElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const focusableElems = useRef<HTMLElement[]>([]);

  const reachFocus = (target: "start" | "end") => {
    if (focusableElems.current.length) {
      if (target === "start") {
        focusableElems.current[0].focus();
      }
      if (target === "end") {
        focusableElems.current[focusableElems.current.length - 1].focus();
      }
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    topAnchor?.current?.addEventListener("focus", () => reachFocus("end"), ac);
    bottomAnchor?.current?.addEventListener("focus", () => reachFocus("start"), ac);

    return () => {
      ac.abort();
    };
  }, [topAnchor, bottomAnchor]);

  useEffect(() => {
    focusableElems.current = getInteractiveDomNodes(childrenRef.current as HTMLDivElement);
  }, [childrenRef, children]);

  useEffect(() => reachFocus("start"), []);

  return (
    <div className="ds-focus-trap">
      <button ref={topAnchor} type="button" className="ds-focus-trap__button" aria-hidden="true" />
      <div className="ds-focus-trap__content" ref={childrenRef}>
        {children}
      </div>
      <button ref={bottomAnchor} type="button" className="ds-focus-trap__button" aria-hidden="true" />
    </div>
  );
};

export default FocusTrap;
