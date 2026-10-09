import React from 'react';
import { FileText, Play, CheckCircle } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section className="text-center max-w-3xl mx-auto pt-6 pb-2 space-y-4 font-sans">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-950/40 border border-[#E50914]/30 text-red-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
        <span>Automated AI Stress-Testing</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
        Can you trust your AI's answers?
      </h2>

      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
        Test how reliably an AI handles confusing questions, conflicting information,
        false assumptions, and missing evidence. Generate challenging tests automatically
        and see where the model succeeds or fails.
      </p>

      {/* Three simple steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
        <div className="p-3.5 rounded-xl bg-[#0F121C] border border-[#202638] flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-red-950/60 border border-[#E50914]/50 text-red-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            1
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-0.5">Enter topic or context</h3>
            <p className="text-[11px] text-zinc-400 leading-snug">Type a subject, paste facts, or upload document text.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F121C] border border-[#202638] flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-red-950/60 border border-[#E50914]/50 text-red-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            2
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-0.5">Generate & run tests</h3>
            <p className="text-[11px] text-zinc-400 leading-snug">Our system creates challenging tests across all categories automatically.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F121C] border border-[#202638] flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-red-950/60 border border-[#E50914]/50 text-red-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            3
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-0.5">Review results</h3>
            <p className="text-[11px] text-zinc-400 leading-snug">See which answers passed, which failed, and why.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
