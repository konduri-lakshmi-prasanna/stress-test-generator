import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, AlertTriangle, Info, XCircle, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isFallback = toast.type === 'fallback';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        const bgClass = isFallback
          ? 'bg-[#181316] border-amber-500/60 shadow-amber-950/40 text-amber-100'
          : isSuccess
          ? 'bg-[#0E1713] border-emerald-500/50 shadow-emerald-950/30 text-emerald-100'
          : isWarning
          ? 'bg-[#1C1710] border-amber-600/50 shadow-amber-950/30 text-amber-100'
          : isError
          ? 'bg-[#1A0E10] border-rose-500/50 shadow-rose-950/30 text-rose-100'
          : 'bg-[#101420] border-blue-500/50 shadow-blue-950/30 text-zinc-100';

        const iconColor = isFallback
          ? 'text-amber-400'
          : isSuccess
          ? 'text-emerald-400'
          : isWarning
          ? 'text-amber-400'
          : isError
          ? 'text-rose-400'
          : 'text-blue-400';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${bgClass}`}
            role="alert"
          >
            <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
              {isFallback ? (
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5" />
              ) : isError ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                  <span>{toast.title}</span>
                  {isFallback && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      FALLBACK
                    </span>
                  )}
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {toast.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-sans">
                {toast.message}
              </p>

              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md border border-zinc-600 transition-colors"
                >
                  <span>{toast.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
