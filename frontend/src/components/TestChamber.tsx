import React, { useState } from 'react';
import { AdversarialScenario, EvaluationResult, AVAILABLE_TARGET_MODELS } from '../types';
import { Play, ShieldAlert, CheckCircle2, XCircle, Terminal, Cpu, Zap } from 'lucide-react';

interface TestChamberProps {
  scenario?: AdversarialScenario | null;
  onRunTest: (scenario: AdversarialScenario, targetModel: string, judgeModel: string) => Promise<EvaluationResult | null>;
  isRunning: boolean;
  latestEvaluation: EvaluationResult | null;
}

export const TestChamber: React.FC<TestChamberProps> = ({
  scenario,
  onRunTest,
  isRunning,
  latestEvaluation
}) => {
  const [targetModel, setTargetModel] = useState('llama-3.1-8b-instant');
  const [judgeModel, setJudgeModel] = useState('llama-3.3-70b-versatile');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'attackOnly'>('sideBySide');

  const modelCategories = Array.from(new Set(AVAILABLE_TARGET_MODELS.map(m => m.category)));

  if (!scenario) {
    return (
      <div id="test-chamber" className="bg-hawkins-panel border border-hawkins-border rounded-xl p-8 text-center font-mono text-zinc-400">
        <ShieldAlert className="w-8 h-8 text-hawkins-amber mx-auto mb-2 animate-pulse" />
        <p className="text-sm">Select a sector or scenario from below to load into the Sensory Chamber.</p>
      </div>
    );
  }

  const handleExecute = () => {
    onRunTest(scenario, targetModel, judgeModel);
  };

  const evalMatchesCurrent = latestEvaluation && latestEvaluation.scenario_id === scenario.id;
  const failureSignals = scenario.failure_signals || [];
  const safeCategory = scenario.category || 'ambiguity';

  return (
    <div id="test-chamber" className="bg-hawkins-panel border border-hawkins-border rounded-xl p-5 shadow-lg scroll-mt-24">
      
      {/* Top Bar: Title & Target Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-hawkins-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-hawkins-crimson font-bold uppercase bg-hawkins-crimson/10 px-2 py-0.5 rounded border border-hawkins-crimson/20">
              ACTIVE TEST CHAMBER // {safeCategory.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-zinc-400">ID: {scenario.id}</span>
          </div>
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            {scenario.title}
          </h2>
          <p className="text-xs text-zinc-300 mt-0.5">
            {scenario.description}
          </p>
        </div>

        {/* Model Selectors & Launch Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-hawkins-dark px-2.5 py-1.5 rounded border border-hawkins-border">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] font-mono text-zinc-400">TARGET:</span>
            <select
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              className="bg-[#0B0D13] text-xs font-mono text-zinc-100 outline-none cursor-pointer border border-zinc-800 rounded px-2 py-1 max-w-[240px]"
            >
              {modelCategories.map(category => (
                <optgroup key={category} label={category} className="bg-hawkins-dark text-zinc-400 font-semibold font-sans">
                  {AVAILABLE_TARGET_MODELS.filter(m => m.category === category).map(model => (
                    <option key={model.id} value={model.id} className="bg-hawkins-card text-zinc-200">
                      {model.name} [{model.speed}]
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <button
            onClick={handleExecute}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              isRunning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-hawkins-crimson hover:bg-hawkins-blood text-white shadow-glow-red hover:shadow-glow-blood border border-hawkins-glow'
            }`}
          >
            {isRunning ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-hawkins-amber" />
                <span>ENGAGING SENSORY TANK...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>DISPATCH ADVERSARIAL ATTACK</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompts Section: Baseline vs Upside Down Attack */}
      <div className="my-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold text-zinc-300">
            PROMPT PAYLOAD INSPECTOR
          </span>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-2.5 py-1 rounded ${viewMode === 'sideBySide' ? 'bg-hawkins-card text-white border border-hawkins-border' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('attackOnly')}
              className={`px-2.5 py-1 rounded ${viewMode === 'attackOnly' ? 'bg-hawkins-card text-white border border-hawkins-border' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Attack Only
            </button>
          </div>
        </div>

        <div className={`grid gap-4 ${viewMode === 'sideBySide' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Baseline Normal Prompt */}
          {viewMode === 'sideBySide' && (
            <div className="p-3.5 rounded-lg bg-hawkins-dark border border-hawkins-border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400">
                  STANDARD BENCHMARK // THE RIGHT-SIDE UP
                </span>
                <span className="text-[10px] font-mono text-zinc-500">CONTROL</span>
              </div>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                {scenario.baseline_prompt || "Standard baseline prompt not configured."}
              </p>
            </div>
          )}

          {/* Adversarial Attack Prompt */}
          <div className="p-3.5 rounded-lg bg-red-950/20 border border-hawkins-crimson/50 shadow-glow-red/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-wider text-hawkins-glow flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                ADVERSARIAL ATTACK // THE UPSIDE DOWN
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-hawkins-crimson text-white">
                {scenario.threat_level || 'HIGH'}
              </span>
            </div>
            
            {scenario.context && (
              <div className="mb-2 p-2 bg-black/40 rounded border border-zinc-800 text-[11px] font-mono text-zinc-400 italic">
                <span className="text-zinc-500 font-bold block mb-0.5">CONTEXT SUPPLIED:</span>
                "{scenario.context}"
              </div>
            )}
            
            <p className="text-xs font-mono text-zinc-100 font-medium leading-relaxed">
              {scenario.attack_prompt}
            </p>
          </div>
        </div>

        {/* Expected Behavior vs Failure Signals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-[11px] font-mono">
          <div className="p-2.5 rounded bg-hawkins-card border border-emerald-950 text-emerald-300">
            <span className="font-bold text-emerald-400 block mb-0.5">✓ EXPECTED RESILIENT BEHAVIOR:</span>
            {scenario.expected_behavior}
          </div>
          <div className="p-2.5 rounded bg-hawkins-card border border-rose-950 text-rose-300">
            <span className="font-bold text-rose-400 block mb-0.5">⚠️ FAILURE SIGNALS TO DETECT:</span>
            {failureSignals.length > 0 ? failureSignals.join(' • ') : 'Standard negative signal verification'}
          </div>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evalMatchesCurrent && (
        <div className="mt-6 pt-5 border-t border-hawkins-border animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">VERDICT ON MODEL:</span>
              <span className="text-xs font-mono font-bold text-white">{latestEvaluation.target_model}</span>
            </div>
            
            {/* Score & Pass Badge */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                latestEvaluation.passed 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
                  : 'bg-red-950/80 border-hawkins-crimson text-hawkins-glow shadow-glow-red animate-pulse'
              }`}>
                {latestEvaluation.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{latestEvaluation.passed ? 'RESILIENT (PASS)' : 'CORRUPTED (VULNERABLE)'}</span>
              </div>
              <div className="text-sm font-mono font-bold text-white">
                SCORE: <span className={latestEvaluation.passed ? 'text-emerald-400' : 'text-hawkins-glow'}>{latestEvaluation.score.toFixed(1)}/100</span>
              </div>
            </div>
          </div>

          {/* Model Response Box */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span>TARGET MODEL OUTPUT:</span>
              <span>{latestEvaluation.model_response.length} chars</span>
            </div>
            <div className="p-3.5 rounded-lg bg-hawkins-dark border border-hawkins-border font-mono text-xs text-zinc-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
              {latestEvaluation.model_response}
            </div>
          </div>

          {/* Judge Evaluation & Heuristics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LLM Judge Reasoning */}
            <div className="p-3.5 rounded-lg bg-hawkins-card border border-hawkins-border">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-hawkins-amber mb-2">
                <Terminal className="w-4 h-4" />
                <span>HAWKINS LLM JUDGE REASONING</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {latestEvaluation.judge_reasoning}
              </p>
              <div className="mt-3 pt-2 border-t border-hawkins-border/60 text-[11px] font-mono text-zinc-400">
                <span className="text-hawkins-amber font-semibold">Recommendation: </span>
                {latestEvaluation.recommendation}
              </div>
            </div>

            {/* Deterministic Scanner Details */}
            <div className="p-3.5 rounded-lg bg-hawkins-card border border-hawkins-border">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-200 mb-2">
                <ShieldAlert className="w-4 h-4 text-hawkins-crimson" />
                <span>HEURISTIC SCANNER TELEMETRY</span>
              </div>
              
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Deterministic Flags:</span>
                  <span className={latestEvaluation.heuristic_results?.flagged ? 'text-hawkins-glow font-bold' : 'text-emerald-400'}>
                    {latestEvaluation.heuristic_results?.flagged ? 'FLAGS RAISED' : 'CLEAR'}
                  </span>
                </div>
                
                {latestEvaluation.heuristic_results?.signals_detected && latestEvaluation.heuristic_results.signals_detected.length > 0 ? (
                  <div className="p-2 bg-red-950/40 rounded border border-hawkins-crimson/30 text-[11px] text-red-300">
                    <span className="font-semibold block mb-1">Detected Signals:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {latestEvaluation.heuristic_results.signals_detected.map((sig, idx) => (
                        <li key={idx}>{sig}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-950/20 rounded border border-emerald-900/50 text-[11px] text-emerald-400">
                    ✓ No prompt leakage, hallucinated citations, or regex boundary failures detected.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
