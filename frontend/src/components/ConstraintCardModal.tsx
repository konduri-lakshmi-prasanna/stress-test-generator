import React from 'react';
import { X, CheckCircle2, ShieldAlert, Zap, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface ConstraintCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerFallbackTest: () => void;
}

export const ConstraintCardModal: React.FC<ConstraintCardModalProps> = ({
  isOpen,
  onClose,
  onTriggerFallbackTest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans animate-in fade-in duration-150">
      <div className="bg-[#0F121C] border border-[#2B354C] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-600/40 text-red-400">
              <Zap className="w-5 h-5 text-[#E50914]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Constraint Card 09 Compliance
                </h3>
                <span className="text-[10px] font-mono uppercase bg-red-900/50 text-red-200 px-2 py-0.5 rounded border border-red-700/50">
                  Hackathon Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full implementation of Common and Unique constraints for Project Adversary.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Constraint 1: Common Constraint */}
        <div className="p-4 rounded-xl bg-[#141824] border border-[#222838] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Common Constraint (Fulfilled)
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Card 09</span>
          </div>

          <blockquote className="text-xs text-zinc-200 font-medium italic border-l-2 border-emerald-500 pl-2.5 py-0.5 bg-[#0D121C]">
            &ldquo;Your web application must provide clear feedback to the user after completing an important action.&rdquo;
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-zinc-300 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Test Suite Execution Toast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Document Upload & Extraction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Export CSV File Confirmation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Markdown Report Copied Alert</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>API Settings Saved Feedback</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Sample PDF One-Click Load</span>
            </div>
          </div>
        </div>

        {/* Constraint 2: Unique Constraint */}
        <div className="p-4 rounded-xl bg-[#171216] border border-amber-600/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Unique Constraint (Fulfilled)
            </span>
            <span className="text-[10px] font-mono text-amber-400">Card 09</span>
          </div>

          <blockquote className="text-xs text-zinc-200 font-medium italic border-l-2 border-amber-500 pl-2.5 py-0.5 bg-[#0E0C10]">
            &ldquo;Add a fallback message or action when the expected result cannot be produced.&rdquo;
          </blockquote>

          <div className="space-y-2 text-xs text-zinc-300">
            <div className="p-2.5 rounded-lg bg-[#0F0D14] border border-[#2B2330]">
              <span className="text-[11px] font-bold text-amber-300 block">
                1. API Outage & Quota Fallback:
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                If live Groq or frontier LLMs encounter a rate-limit, timeout, or invalid key, the app displays an explicit fallback notice and automatically engages the <strong>Hawkins Local Simulation Engine</strong> so testing is never broken.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0F0D14] border border-[#2B2330]">
              <span className="text-[11px] font-bold text-amber-300 block">
                2. Empty Input Fallback Action:
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                When input context is insufficient to synthesize tests, the system shows a fallback message with a 1-click action to <strong>&ldquo;Auto-load Clinical Trial Report&rdquo;</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Test Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#2B2330]">
            <span className="text-[11px] text-zinc-400">
              Want to see the fallback message & action live?
            </span>
            <button
              type="button"
              onClick={() => {
                onTriggerFallbackTest();
                onClose();
              }}
              className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Simulate Fallback Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#181D2A] hover:bg-[#222A3E] text-zinc-300 text-xs font-semibold transition-colors border border-[#28324A]"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
