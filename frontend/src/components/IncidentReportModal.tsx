import React from 'react';
import { BenchmarkReport } from '../types';
import { ShieldCheck, FileDown, Printer, X, Copy, Check } from 'lucide-react';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: BenchmarkReport;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const markdownContent = `# HAWKINS NATIONAL LABORATORY // ADVERSARIAL STRESS-TEST AUDIT
**Classification:** Declassified Executive Summary
**Date:** ${new Date().toISOString()}
**Protocol:** Project Adversary (10-Vector Automated Red-Teaming Harness)

---

## EXECUTIVE SUMMARY
- **Overall Resilience Score:** ${report.overall_resilience_score.toFixed(1)} / 100
- **Mind Flayer Vulnerability Index:** ${report.mind_flayer_index.toFixed(1)}%
- **Status:** ${report.hawkins_status}
- **Total Evaluations:** ${report.total_tests} (${report.passed_tests} Passed / ${report.failed_tests} Failed)

---

## 10 ADVERSARIAL VECTORS BREAKDOWN
${Object.values(report.categories).map((c, i) => `
### ${i + 1}. ${c.name} (${c.category})
- **Resilience Score:** ${c.avg_score.toFixed(1)}%
- **Threat Status:** ${c.threat_status}
- **Tests Evaluated:** ${c.total_tests} (Passed: ${c.passed_count}, Failed: ${c.failed_count})
`).join('\n')}

---

## KEY VULNERABILITY MITIGATIONS
1. **Ambiguity:** Introduce parametric confidence gates requesting clarification when variables are omitted.
2. **Contradiction:** Implement contradiction detection layers in RAG synthesis.
3. **False Premise:** Force explicit premise verification prior to generative output.
4. **Evidence Gaps:** Calibrate zero-evidence admissions ("Not found in context").
5. **Prompt Injection:** Employ strict semantic delimiters and instruction isolation.
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-hawkins-panel border-2 border-hawkins-crimson shadow-glow-red rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col p-6 text-zinc-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hawkins-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-hawkins-dark rounded border border-hawkins-border text-hawkins-glow">
              <ShieldCheck className="w-5 h-5 text-hawkins-crimson" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-hawkins-amber font-bold tracking-widest uppercase">
                HAWKINS NATIONAL LABORATORY // DECLASSIFIED AUDIT
              </div>
              <h2 className="text-base font-bold font-mono text-white">
                ADVERSARIAL STRESS-TEST BENCHMARK DOSSIER
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white font-mono">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs pr-1">
          
          {/* Top Score Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-hawkins-dark rounded-lg border border-hawkins-border">
              <span className="text-[10px] text-zinc-400 block mb-1">RESILIENCE SCORE</span>
              <span className="text-xl font-bold text-emerald-400">
                {report.overall_resilience_score.toFixed(1)}%
              </span>
            </div>
            <div className="p-3 bg-hawkins-dark rounded-lg border border-hawkins-crimson/50 shadow-glow-red/20">
              <span className="text-[10px] text-zinc-400 block mb-1">MIND FLAYER INDEX</span>
              <span className="text-xl font-bold text-hawkins-glow">
                {report.mind_flayer_index.toFixed(1)}%
              </span>
            </div>
            <div className="p-3 bg-hawkins-dark rounded-lg border border-hawkins-border">
              <span className="text-[10px] text-zinc-400 block mb-1">TOTAL TESTS</span>
              <span className="text-xl font-bold text-zinc-100">
                {report.total_tests}
              </span>
            </div>
            <div className="p-3 bg-hawkins-dark rounded-lg border border-hawkins-border">
              <span className="text-[10px] text-zinc-400 block mb-1">FACILITY STATUS</span>
              <span className="text-xs font-bold text-hawkins-amber uppercase mt-1 block">
                {report.hawkins_status}
              </span>
            </div>
          </div>

          {/* 10 Categories Table */}
          <div className="bg-hawkins-dark rounded-lg border border-hawkins-border overflow-hidden">
            <div className="p-2.5 bg-hawkins-card border-b border-hawkins-border font-bold text-zinc-300 text-[11px]">
              EVALUATION BREAKDOWN ACROSS 10 ADVERSARIAL DIMENSIONS
            </div>
            <div className="divide-y divide-hawkins-border/60">
              {Object.values(report.categories).map((cat, idx) => (
                <div key={cat.category} className="p-2.5 flex items-center justify-between text-[11px] hover:bg-zinc-900/50">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold w-4">#{idx + 1}</span>
                    <span className="font-semibold text-zinc-200">{cat.name}</span>
                    <span className="text-zinc-500 text-[10px]">({cat.category})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-[10px]">{cat.passed_count}P / {cat.failed_count}F</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      cat.avg_score >= 70 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-hawkins-glow'
                    }`}>
                      {Math.round(cat.avg_score)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-hawkins-border flex items-center justify-between font-mono text-xs">
          <span className="text-zinc-500 text-[10px]">
            HAWKINS LAB STRESS BENCHMARK // 24H HACKATHON EDITION
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-hawkins-dark hover:bg-zinc-800 text-zinc-300 border border-hawkins-border transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED MARKDOWN' : 'COPY MARKDOWN'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-hawkins-crimson hover:bg-hawkins-blood text-white shadow-glow-red font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / EXPORT REPORT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
