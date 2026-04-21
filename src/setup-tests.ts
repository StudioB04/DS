import "@testing-library/jest-dom";
import "vitest-axe/extend-expect";
import "vitest-axe/matchers";

import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}
