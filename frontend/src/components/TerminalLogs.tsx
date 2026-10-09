import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Cpu } from 'lucide-react';

interface TerminalLogsProps {
  logs: string[];
  onClearLogs: () => void;
  isStreaming?: boolean;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs, onClearLogs, isStreaming }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-hawkins-dark border border-hawkins-border rounded-xl p-4 font-mono text-xs flex flex-col h-72 shadow-inner">
      {/* Console Top Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-hawkins-border/70 text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-hawkins-phosphor" />
          <span className="text-[11px] font-bold text-zinc-300">
            HAWKINS CRT TELEMETRY CONSOLE // LANGGRAPH DISPATCH
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-[10px] text-hawkins-amber font-semibold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-hawkins-amber" />
              LIVE TELEMETRY ACTIVE
            </span>
          )}
        </div>
        <button
          onClick={onClearLogs}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          title="Clear Terminal Output"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Console Scrollable Window */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-[11px] leading-relaxed font-mono select-text">
        {logs.length === 0 ? (
          <div className="text-zinc-600 italic">
            // Telemetry stream ready. Select an adversarial scenario and execute a stress attack.
          </div>
        ) : (
          logs.map((log, i) => {
            const isError = log.includes('❌') || log.includes('CRITICAL');
            const isWarning = log.includes('⚠️') || log.includes('WARNING');
            const isSuccess = log.includes('✓') || log.includes('RESILIENT');
            const isGraphStep = log.includes('LangGraph') || log.includes('⚡') || log.includes('🎯');

            return (
              <div
                key={i}
                className={`transition-colors ${
                  isError
                    ? 'text-hawkins-glow font-bold'
                    : isWarning
                    ? 'text-hawkins-amber font-medium'
                    : isSuccess
                    ? 'text-emerald-400'
                    : isGraphStep
                    ? 'text-cyan-400 font-semibold'
                    : 'text-zinc-400'
                }`}
              >
                <span className="text-zinc-600 select-none mr-2">[{i + 1}]</span>
                {log}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Console Input Footer Prompt */}
      <div className="pt-2 mt-2 border-t border-hawkins-border/50 flex items-center justify-between text-[10px] text-zinc-500">
        <div className="flex items-center gap-1">
          <span className="text-hawkins-phosphor">hawkins@doe-terminal:~$</span>
          <span className="animate-pulse text-hawkins-phosphor font-bold">█</span>
        </div>
        <span>LANGGRAPH // GROQ INFERENCE HARNESS</span>
      </div>
    </div>
  );
};
