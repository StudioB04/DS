import clsx from "clsx";
import type { FakeComponentProps } from "./FakeComponent.types";

import "./FakeComponent.css";

const FakeComponent = ({ test, className, ...restProps }: FakeComponentProps) => (
  <p className={clsx("ds-fake-component", `ds-fake-component--${test}`, className)} {...restProps}>
    {test}
  </p>
);

export default FakeComponent;
