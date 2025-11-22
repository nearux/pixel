import { type PropsWithChildren } from "react";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  ErrorBoundary as ReactErrorBoundary,
  type ErrorBoundaryProps,
  type ErrorBoundaryPropsWithRender,
} from "react-error-boundary";

type Props = Omit<
  ErrorBoundaryProps,
  "fallbackRender" | "FallbackComponent"
> & {
  errorFallback: ErrorBoundaryPropsWithRender["fallbackRender"];
};

export const ErrorBoundary = ({
  errorFallback,
  children,
}: PropsWithChildren<Props>) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ReactErrorBoundary fallbackRender={errorFallback} onReset={reset}>
      {children}
    </ReactErrorBoundary>
  );
};
