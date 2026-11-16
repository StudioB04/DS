import { debounce } from "$utils";
import { useEffect, useState } from "react";

export enum Breakpoints {
  SM = 37.5 * 16,
  MD = 61.25 * 16,
  LG = 75 * 16,
  XL = 112.5 * 16,
}

interface WindowSizeInterface {
  width?: number;
  height?: number;
}

export interface BreakpointUtilsInterface {
  isSm?: boolean;
  isMd?: boolean;
  isLg?: boolean;
  isXl?: boolean;
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSizeInterface>({
    width: undefined,
    height: undefined,
  });

  const [breakpointUtils, setBreakpointUtils] = useState<BreakpointUtilsInterface>({
    isSm: undefined,
    isMd: undefined,
    isLg: undefined,
    isXl: undefined,
  });

  const matchBreakpoint = (breakpoint: number = 0) => globalThis?.matchMedia(`(min-width: ${breakpoint}px)`).matches;

  useEffect(() => {
    const setValues = () => {
      setWindowSize({
        width: globalThis.innerWidth,
        height: globalThis.innerHeight,
      });
      setBreakpointUtils({
        isSm: matchBreakpoint(Breakpoints.SM),
        isMd: matchBreakpoint(Breakpoints.MD),
        isLg: matchBreakpoint(Breakpoints.LG),
        isXl: matchBreakpoint(Breakpoints.XL),
      });
    };

    setValues();

    const onResize = debounce(setValues, 100);
    globalThis.addEventListener("resize", onResize);

    return () => {
      globalThis.removeEventListener("resize", onResize);
      onResize.cancel();
    };
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    ...breakpointUtils,
  };
};
