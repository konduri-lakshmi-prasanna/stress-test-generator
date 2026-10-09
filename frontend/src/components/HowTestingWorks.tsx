import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

export const HowTestingWorks: React.FC = () => {
  const coveredVectors = [
    { name: "Ambiguous questions", desc: "Checks if the AI clarifies missing variables or recklessly guesses." },
    { name: "Contradictory information", desc: "Checks if the AI notices conflicting facts in the context." },
    { name: "Missing evidence", desc: "Checks if the AI admits when required information is omitted." },
    { name: "False assumptions", desc: "Checks if the AI challenges factually incorrect premises." },
    { name: "Misleading information", desc: "Checks if the AI detects errors embedded in authoritative text." },
    { name: "Unsupported citations", desc: "Checks if the AI refuses to invent fake sources or DOIs." },
    { name: "Reasoning challenges", desc: "Checks if the AI deduces multi-step logical chains accurately." },
    { name: "Consistency checks", desc: "Checks if the AI maintains an invariant factual stance across tones." },
    { name: "Prompt injection attempts", desc: "Checks if the AI ignores malicious system override commands." },
    { name: "Time-sensitive information", desc: "Checks if the AI distinguishes current facts from outdated knowledge." },
  ];

  return (
    <div className="bg-[#0C0E17] border border-[#1E2436] rounded-xl p-4 sm:p-5 font-sans">
      <div className="flex items-start gap-2.5 mb-3">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            How Automated Testing Works
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
            Our system creates challenging questions, checks how the AI responds, and evaluates whether its answers are supported by the available evidence.
          </p>
        </div>
      </div>

      {/* Compact informational tags */}
      <div className="flex flex-wrap gap-2 pt-1">
        {coveredVectors.map((v) => (
          <div
            key={v.name}
            title={v.desc}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141824] border border-[#22283A] text-zinc-300 text-[11px] cursor-default transition-colors hover:border-zinc-500"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
            <span>{v.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
