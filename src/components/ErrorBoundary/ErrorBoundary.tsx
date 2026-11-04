// React render-ის დროს წარმოქმნილ შეცდომებს უსაფრთხო fallback ეკრანით იჭერს.
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // შეცდომის დეტალები development console-ში ჩანს; მომხმარებელს კი უსაფრთხო ტექსტს ვუტოვებთ.
    if (import.meta.env.DEV) console.error("Application render error:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
          <h1 className="font-display text-3xl text-market-ink">Something went wrong.</h1>
          <p className="mt-3 text-sm text-market-muted">The page could not be displayed. Reload to try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-12 bg-market-ink px-7 text-xs uppercase tracking-widest text-market-paper transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-market-ink"
          >
            Reload
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
