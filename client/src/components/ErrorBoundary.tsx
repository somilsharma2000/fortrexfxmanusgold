import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (!import.meta.env.DEV) return;

    const diagnostic = {
      name: error.name || "Error",
      message: error.message || "Unknown render error",
      stack: error.stack || "No stack trace available",
      componentStack: info.componentStack || "No component stack available",
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      online: navigator.onLine,
    };

    console.groupCollapsed("[Fortrex ErrorBoundary] Render failure");
    console.error("Error object:", error);
    console.table({
      name: diagnostic.name,
      message: diagnostic.message,
      url: diagnostic.url,
      timestamp: diagnostic.timestamp,
      online: diagnostic.online,
    });
    console.log("Stack trace:\n" + diagnostic.stack);
    console.log("React component stack:\n" + diagnostic.componentStack);
    console.groupEnd();
  }

  private retryRender = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-4">An unexpected error occurred.</h2>

            {import.meta.env.DEV ? <div className="mb-6 w-full overflow-auto rounded bg-muted p-4"><pre className="whitespace-break-spaces text-sm text-muted-foreground">{this.state.error?.stack}</pre></div> : <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">Please reload the page. If the problem continues, contact the Fortrex support desk.</p>}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.retryRender}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "border border-primary/40 bg-primary/10 text-primary",
                  "hover:bg-primary/20 cursor-pointer"
                )}
              >
                <RotateCcw size={16} />
                Retry
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
                <RotateCcw size={16} />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
