import { PixelBoard } from "@/features/pixels/components/PixelBoard";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary
      errorFallback={(props) => <PixelBoard.ErrorFallback {...props} />}
    >
      <PixelBoard />
    </ErrorBoundary>
  );
}
