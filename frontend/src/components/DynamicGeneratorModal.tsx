import React, { useState } from 'react';
import { CategoryId, AdversarialScenario } from '../types';
import { CATEGORIES_META } from '../data/seedData';
import { generateAdversarialScenario } from '../services/api';
import { Sparkles, Terminal, ShieldAlert, X, Zap } from 'lucide-react';

interface DynamicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScenarioGenerated: (scenario: AdversarialScenario) => void;
}

export const DynamicGeneratorModal: React.FC<DynamicGeneratorModalProps> = ({
  isOpen,
  onClose,
  onScenarioGenerated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('false_premise');
  const [domain, setDomain] = useState('Medical Diagnosis');
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const scenario = await generateAdversarialScenario(
        selectedCategory,
        domain.trim() || 'General',
        instructions.trim() || undefined
      );
      onScenarioGenerated(scenario);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const domainPresets = [
    'Medical Clinical Trials',
    'Financial SEC Filings',
    'Autonomous Vehicle Sensors',
    'Smart Contracts & Crypto',
    'Constitutional Law Precedents',
    'Quantum Computing Physics'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-hawkins-panel border-2 border-hawkins-crimson/80 shadow-glow-red rounded-xl max-w-xl w-full p-6 text-zinc-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-hawkins-border">
          <div className="flex items-center gap-2 text-hawkins-glow font-mono font-bold text-sm">
            <Sparkles className="w-5 h-5 text-hawkins-crimson animate-pulse" />
            <span>THE VOID // ADVERSARIAL SCENARIO SYNTHESIZER</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white font-mono">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="mt-4 space-y-4 font-mono text-xs">
          
          {/* Category Select */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              1. TARGET ADVERSARIAL VECTOR (10 CATEGORIES):
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
              className="w-full bg-hawkins-dark border border-hawkins-border focus:border-hawkins-crimson px-3 py-2 rounded text-zinc-100 outline-none"
            >
              {Object.values(CATEGORIES_META).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.code_name}: {cat.name} — {cat.question}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Input */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              2. KNOWLEDGE DOMAIN / SUBJECT TOPIC:
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Pediatric Oncology, High-Frequency Trading, Cybersecurity..."
              className="w-full bg-hawkins-dark border border-hawkins-border focus:border-hawkins-crimson px-3 py-2 rounded text-zinc-100 outline-none"
              required
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {domainPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setDomain(preset)}
                  className="text-[10px] bg-hawkins-card hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded border border-hawkins-border"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Optional instructions */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              3. ADVERSARIAL TRAP CONSTRAINTS (OPTIONAL):
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Include subtle conflicting dates in paragraph 2, or embed an indirect prompt override..."
              className="w-full bg-hawkins-dark border border-hawkins-border focus:border-hawkins-crimson px-3 py-2 rounded text-zinc-100 outline-none resize-none"
            />
          </div>

          {/* Department warning */}
          <div className="p-3 bg-red-950/30 rounded border border-hawkins-crimson/30 text-[11px] text-red-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-hawkins-glow shrink-0 mt-0.5" />
            <span>
              Hawkins Protocol: Synthesized adversarial tests evaluate edge cases beyond conventional benchmarks to expose hallucination, sycophancy, and boundary leaks.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-hawkins-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className={`flex items-center gap-1.5 px-4 py-1.5 font-bold rounded text-white transition-all ${
                isGenerating 
                  ? 'bg-zinc-700 cursor-not-allowed' 
                  : 'bg-hawkins-crimson hover:bg-hawkins-blood shadow-glow-red'
              }`}
            >
              {isGenerating ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin text-hawkins-amber" />
                  <span>SYNTHESIZING ATTACK...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SYNTHESIZE ADVERSARIAL SCENARIO</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
