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

  // Suit aussi les changements de taille de l'élément (animation au scroll, contenu, polices, zoom…)
  let observer: ResizeObserver | undefined;
  if (element && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(updateHTMLCustomProp);
    observer.observe(element, { box: "border-box" });
  }

  return () => {
    handleResize.cancel();
    observer?.disconnect();
    updateHTMLCustomProp();
    globalThis.removeEventListener("resize", handleResize);
  };
}
