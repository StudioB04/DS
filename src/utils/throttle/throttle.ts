/**
 * Guarantee that a function will be invoked only once every x milliseconds.
 */
export default function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;

  return function (...args: Parameters<T>): void {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= wait) {
      func(...args);
      lastCallTime = now;
    } else if (!timeout) {
      const remainingTime = wait - (now - (lastCallTime || 0));

      timeout = setTimeout(() => {
        func(...args);
        lastCallTime = Date.now();
        timeout = null;
      }, remainingTime);
    }
  };
}
