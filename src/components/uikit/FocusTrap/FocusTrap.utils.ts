export const InteractiveDomNodesSelectors: string = [
  'a:not([tabindex="-1"])',
  'button:not([tabindex="-1"]):not(:disabled)',
  'input:not([tabindex="-1"]):not(:disabled)',
  'select:not([tabindex="-1"]):not(:disabled)',
  'textarea:not([tabindex="-1"]):not(:disabled)',
  '[tabindex="0"]',
].join(", ");

export const getInteractiveDomNodes = (container: HTMLElement) => {
  const interactiveElems: NodeListOf<HTMLElement> = container.querySelectorAll(InteractiveDomNodesSelectors);
  return Array.from(interactiveElems);
};
