import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";

import FakeComponent from "./FakeComponent";

describe("FakeComponent component", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<FakeComponent test={3} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
