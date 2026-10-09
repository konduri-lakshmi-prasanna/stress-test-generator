import React from 'react';
import { Settings, Shield, Sparkles, CheckCircle, Info } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onOpenSettings: () => void;
  onOpenConstraintCard?: () => void;
  executionMode?: 'LIVE_API' | 'DEMO_SIMULATION' | 'FALLBACK_ENGAGED';
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  onOpenSettings,
  onOpenConstraintCard,
  executionMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0C10]/95 backdrop-blur border-b border-[#202534] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-[#E50914]/40 text-[#E50914] shadow-sm">
            <Shield className="w-5 h-5 text-[#E50914]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white font-sans">
                Project Adversary
              </h1>
              <span className="text-[10px] font-mono uppercase bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-800/50">
                Stress-Test Harness
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              AI Hallucination Stress-Test Generator
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Hackathon Constraint Card 09 Pill */}
          <button
            onClick={onOpenConstraintCard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-all hover:scale-105"
            title="View Constraint Card 09 (Action Feedback & Fallback Action)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Constraint Card 09</span>
            <span className="sm:hidden">Card 09</span>
          </button>

          {/* Mode Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border bg-[#121622] border-[#222838] text-zinc-300">
            {hasApiKey ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-medium">Groq Connected</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300 font-medium">Demo Mode</span>
              </>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#141824] hover:bg-[#1E2334] text-zinc-200 border border-[#282F44] transition-all hover:border-zinc-500"
            title="Configure Groq API Key and preferences"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
};
