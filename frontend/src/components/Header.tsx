import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Key, Tv, RefreshCw, Radio, Flame } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/api';

interface HeaderProps {
  crtEnabled: boolean;
  onToggleCrt: () => void;
  mindFlayerIndex: number;
  onResetBenchmark: () => void;
  onOpenGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  crtEnabled,
  onToggleCrt,
  mindFlayerIndex,
  onResetBenchmark,
  onOpenGenerator
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    setHasKey(!!key);
    setApiKeyInput(key);
  }, []);

  const handleSaveKey = () => {
    setApiKey(apiKeyInput.trim());
    setHasKey(!!apiKeyInput.trim());
    setShowKeyModal(false);
  };

  const isCriticalBreach = mindFlayerIndex > 40;

  return (
    <>
      <header className="sticky top-0 z-40 bg-hawkins-panel/95 backdrop-blur border-b border-hawkins-border/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Department of Energy Banner */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${isCriticalBreach ? 'bg-red-950/60 border-hawkins-crimson text-hawkins-glow shadow-glow-red animate-pulse' : 'bg-hawkins-card border-hawkins-border text-hawkins-amber'}`}>
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-hawkins-amber font-semibold uppercase bg-hawkins-amber/10 px-2 py-0.5 rounded border border-hawkins-amber/20">
                  U.S. DEPT OF ENERGY // HAWKINS DIVISION
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  DOC ID: AGY-1983-V2
                </span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-wider hawkins-title">
                PROJECT ADVERSARY
              </h1>
              <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-hawkins-crimson animate-ping" />
                AUTOMATED 10-VECTOR ADVERSARIAL STRESS-TEST BENCHMARK
              </p>
            </div>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Mind Flayer Index Pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-medium ${
              isCriticalBreach 
                ? 'bg-hawkins-crimson/15 border-hawkins-crimson text-hawkins-glow shadow-glow-red' 
                : 'bg-hawkins-card border-hawkins-border text-zinc-300'
            }`}>
              <Flame className="w-4 h-4 text-hawkins-crimson animate-pulse" />
              <span>MIND FLAYER INDEX:</span>
              <span className="font-bold text-sm text-hawkins-glow">{mindFlayerIndex.toFixed(1)}%</span>
            </div>

            {/* Synthesizer Trigger Button */}
            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-hawkins-card hover:bg-hawkins-card/80 text-hawkins-amber border border-hawkins-amber/30 hover:border-hawkins-amber shadow-glow-amber transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SYNTHESIZE ATTACK</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-all ${
                hasKey 
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                  : 'bg-hawkins-card border-hawkins-border text-zinc-300 hover:border-hawkins-crimson'
              }`}
              title="Configure Groq API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasKey ? 'GROQ KEY: SET' : 'CONFIG GROQ'}</span>
            </button>

            {/* CRT Toggle Button */}
            <button
              onClick={onToggleCrt}
              className={`p-2 rounded-md border text-xs font-mono transition-all ${
                crtEnabled 
                  ? 'bg-hawkins-crimson/20 border-hawkins-crimson text-white shadow-glow-red' 
                  : 'bg-hawkins-card border-hawkins-border text-zinc-400 hover:text-zinc-200'
              }`}
              title="Toggle Retro CRT Scanlines"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Reset History */}
            <button
              onClick={onResetBenchmark}
              className="p-2 rounded-md border border-hawkins-border bg-hawkins-card text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
              title="Reset Test History"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-hawkins-panel border-2 border-hawkins-crimson/80 shadow-glow-red rounded-xl max-w-md w-full p-6 text-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-hawkins-border">
              <div className="flex items-center gap-2 text-hawkins-glow font-mono font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>GROQ CLASSIFIED CREDENTIALS</span>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <p className="text-zinc-300">
                Enter your Groq API Key for real-time high-speed inference on Llama 3.3 70B & 3.1 8B.
              </p>
              <div className="p-2.5 bg-hawkins-dark rounded border border-zinc-800 text-zinc-400 text-[11px]">
                💡 Tip: If you don't enter a key, the system will use the backend environment key or run in the built-in Hawkins simulation mode.
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">GROQ_API_KEY:</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-hawkins-dark border border-hawkins-border focus:border-hawkins-crimson px-3 py-2 rounded text-zinc-100 font-mono text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-hawkins-border">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 text-xs font-mono font-bold rounded bg-hawkins-crimson hover:bg-hawkins-blood text-white shadow-glow-red"
              >
                AUTHORIZE KEY
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
