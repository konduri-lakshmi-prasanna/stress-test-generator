import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hawkins Lab UI Error Caught:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-hawkins-dark text-zinc-200 flex flex-col items-center justify-center p-6 font-mono text-xs">
          <div className="max-w-md w-full bg-hawkins-panel border-2 border-hawkins-crimson rounded-xl p-6 shadow-glow-red text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-950/60 border border-hawkins-crimson text-hawkins-glow shadow-glow-red animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[10px] text-hawkins-amber font-bold tracking-widest uppercase">
                HAWKINS CONTAINMENT BREACH // ANOMALY DETECTED
              </div>
              <h1 className="text-lg font-bold text-white mt-1">
                RENDER CONTAINMENT FAILURE
              </h1>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                An unexpected anomaly occurred during telemetry rendering.
              </p>
              {this.state.error && (
                <div className="p-2.5 bg-black/50 border border-zinc-800 rounded text-[11px] text-red-400 font-mono text-left overflow-x-auto mt-3">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-hawkins-crimson hover:bg-hawkins-blood text-white font-bold text-xs shadow-glow-red transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RE-INITIALIZE HAWKINS TERMINAL</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
