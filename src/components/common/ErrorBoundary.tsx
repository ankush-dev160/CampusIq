import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.replace('/');
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-2xl w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-red-500/20 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xl">
                ⚠️
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Application Error Encountered
                </h1>
                <p className="text-xs text-red-300 mt-0.5">
                  An unhandled exception caused the view to crash.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs overflow-x-auto text-red-300">
                <p className="font-bold text-red-400">{this.state.error?.name}: {this.state.error?.message}</p>
                {this.state.error?.stack && (
                  <pre className="mt-3 text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>

              {this.state.errorInfo?.componentStack && (
                <details className="text-xs text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-200 font-semibold mb-2">
                    Component Stack Trace
                  </summary>
                  <pre className="bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-slate-500 overflow-x-auto whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-95 transition-all shadow-md"
                >
                  Reload Application
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  Clear Session & Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
