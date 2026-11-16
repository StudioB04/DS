import debounce from "$utils/debounce/debounce";

export function setHTMLCustomProp(
  element: HTMLElement | null,
  property: keyof HTMLElement,
  name: string,
  attacheStyleTo: HTMLElement | null = globalThis.document.documentElement,
) {
  function updateHTMLCustomProp() {
    const value = `${(element?.[property] as number | undefined) ?? 0}px`;
    attacheStyleTo?.style?.setProperty(name, value);
  }

  const handleResize = debounce(updateHTMLCustomProp, 100);

  updateHTMLCustomProp();
  globalThis.addEventListener("resize", handleResize);

  return () => {
    handleResize.cancel();
    updateHTMLCustomProp();
    globalThis.removeEventListener("resize", handleResize);
  };
}
