import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RadarChart } from './components/RadarChart';
import { CategoryCard } from './components/CategoryCard';
import { TestChamber } from './components/TestChamber';
import { DynamicGeneratorModal } from './components/DynamicGeneratorModal';
import { TerminalLogs } from './components/TerminalLogs';
import { IncidentReportModal } from './components/IncidentReportModal';

import {
  CategoryMeta,
  AdversarialScenario,
  EvaluationResult,
  BenchmarkReport,
  CategoryId
} from './types';
import { CATEGORIES_META, SEED_SCENARIOS, INITIAL_BENCHMARK_REPORT } from './data/seedData';
import { fetchCategories, fetchScenarios, runAdversarialTest, fetchBenchmarkReport } from './services/api';
import { Sparkles, FileText, Search, Radio, Flame } from 'lucide-react';

export const App: React.FC = () => {
  // State
  const [categories, setCategories] = useState<CategoryMeta[]>(Object.values(CATEGORIES_META));
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('false_premise');
  const [scenarios, setScenarios] = useState<AdversarialScenario[]>(SEED_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<AdversarialScenario>(SEED_SCENARIOS[3]);
  const [benchmarkReport, setBenchmarkReport] = useState<BenchmarkReport>(INITIAL_BENCHMARK_REPORT);
  const [latestEvaluation, setLatestEvaluation] = useState<EvaluationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "⚡ [System Initialized] Hawkins Lab Project Adversary online.",
    "✓ 10 Adversarial Dimensions loaded into containment matrix.",
    "💡 Ready for evaluation. Select a scenario or generate dynamic attacks."
  ]);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const cats = await fetchCategories();
        if (cats && cats.length > 0) setCategories(cats);

        const scens = await fetchScenarios();
        if (scens && scens.length > 0) {
          setScenarios(scens);
          setSelectedScenario(scens[0]);
        }

        const rep = await fetchBenchmarkReport();
        if (rep) setBenchmarkReport(rep);
      } catch (e) {
        console.warn("API initialization fallback:", e);
      }
    }
    loadData();
  }, []);

  // Safe category selector with smooth scroll
  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    const scen = scenarios.find((s) => s.category === catId) || SEED_SCENARIOS.find((s) => s.category === catId);
    if (scen) setSelectedScenario(scen);
    document.getElementById('test-chamber')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Run test handler
  const handleRunTest = async (
    scenario: AdversarialScenario,
    targetModel: string,
    judgeModel: string
  ): Promise<EvaluationResult | null> => {
    setIsRunningTest(true);
    setLogs((prev) => [
      ...prev,
      `--- INITIATING STRESS RUN: ${scenario.title} ---`,
      `🎯 Target Model: ${targetModel} | Judge Model: ${judgeModel}`,
      `⚡ [LangGraph::Workflow] Entering StateGraph node: 'scenario_generator'`
    ]);

    try {
      const result = await runAdversarialTest(scenario, targetModel, judgeModel);
      setLatestEvaluation(result.evaluation);
      setLogs((prev) => [...prev, ...result.logs]);

      // Update benchmark report in state safely
      setBenchmarkReport((prev) => {
        const catKey = scenario.category;
        const currentCat = prev.categories?.[catKey] || {
          category: catKey,
          name: CATEGORIES_META[catKey]?.name || catKey,
          passed_count: 0,
          failed_count: 0,
          total_tests: 0,
          avg_score: 80,
          threat_status: 'CONTAINED'
        };

        const newPassed = currentCat.passed_count + (result.evaluation.passed ? 1 : 0);
        const newFailed = currentCat.failed_count + (result.evaluation.passed ? 0 : 1);
        const newTotal = currentCat.total_tests + 1;
        const newCatAvg = ((currentCat.avg_score * currentCat.total_tests) + result.evaluation.score) / newTotal;

        const updatedCategories = {
          ...prev.categories,
          [catKey]: {
            ...currentCat,
            passed_count: newPassed,
            failed_count: newFailed,
            total_tests: newTotal,
            avg_score: newCatAvg,
            threat_status: newCatAvg < 70 ? 'UNSTABLE' : 'CONTAINED'
          }
        };

        const totalTestsAll = (prev.total_tests || 0) + 1;
        const passedTestsAll = (prev.passed_tests || 0) + (result.evaluation.passed ? 1 : 0);
        const failedTestsAll = (prev.failed_tests || 0) + (result.evaluation.passed ? 0 : 1);
        const prevResilience = prev.overall_resilience_score || 80.0;
        const avgResilience = ((prevResilience * (prev.total_tests || 1)) + result.evaluation.score) / totalTestsAll;

        return {
          ...prev,
          overall_resilience_score: avgResilience,
          mind_flayer_index: Math.max(0, 100 - avgResilience),
          total_tests: totalTestsAll,
          passed_tests: passedTestsAll,
          failed_tests: failedTestsAll,
          categories: updatedCategories,
          recent_evaluations: [result.evaluation, ...(prev.recent_evaluations || [])].slice(0, 10)
        };
      });

      return result.evaluation;
    } catch (err) {
      setLogs((prev) => [...prev, `❌ [Execution Error]: ${String(err)}`]);
      return null;
    } finally {
      setIsRunningTest(false);
    }
  };

  // Quick Run a whole Sector
  const handleQuickRunSector = (catId: CategoryId) => {
    setSelectedCategory(catId);
    const scen = scenarios.find((s) => s.category === catId) || SEED_SCENARIOS.find((s) => s.category === catId);
    if (scen) {
      setSelectedScenario(scen);
      handleRunTest(scen, 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile');
      document.getElementById('test-chamber')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset benchmark
  const handleResetBenchmark = () => {
    setBenchmarkReport(INITIAL_BENCHMARK_REPORT);
    setLatestEvaluation(null);
    setLogs((prev) => [...prev, "🔄 Containment matrix reset to initial baseline."]);
  };

  // Filtered Scenarios
  const filteredScenarios = scenarios.filter((s) => {
    const matchesCat = filterCategory === 'all' || s.category === filterCategory;
    const titleMatch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const descMatch = s.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const tagsMatch = s.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) || false;
    const matchesSearch = searchQuery === '' || titleMatch || descMatch || tagsMatch;
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-hawkins-dark text-zinc-100 flex flex-col font-sans">
      
      {/* CRT Scanline Overlay Effect */}
      {crtEnabled && <div className="crt-overlay" />}

      {/* Top Navigation & Controls */}
      <Header
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        mindFlayerIndex={benchmarkReport.mind_flayer_index || 0}
        onResetBenchmark={handleResetBenchmark}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Banner Alert if Breach */}
        {(benchmarkReport.mind_flayer_index || 0) > 25 && (
          <div className="p-3 bg-red-950/60 border border-hawkins-crimson rounded-xl shadow-glow-red flex items-center justify-between text-xs font-mono text-zinc-200 animate-pulse">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-hawkins-glow animate-bounce" />
              <span>
                <strong>ALERT: UPSIDE DOWN ANOMALY DETECTED.</strong> Target model shows vulnerability in {
                  Object.values(benchmarkReport.categories || {}).filter(c => c.avg_score < 70).map(c => c.name).join(', ') || 'multiple vectors'
                }.
              </span>
            </div>
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-3 py-1 rounded bg-hawkins-crimson text-white font-bold hover:bg-hawkins-blood transition-all"
            >
              INSPECT DOSSIER
            </button>
          </div>
        )}

        {/* Section 1: Top Dashboard (Radar Polygon + Real-Time Telemetry) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Radar Chart (7 cols on lg) */}
          <div className="lg:col-span-7">
            <RadarChart
              categories={benchmarkReport.categories || INITIAL_BENCHMARK_REPORT.categories}
              onSelectCategory={handleSelectCategory}
            />
          </div>

          {/* Telemetry Console & Quick Actions (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-hawkins-panel border border-hawkins-border rounded-xl">
                <div className="text-[10px] font-mono text-zinc-400 mb-0.5">RESILIENCE SCORE</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {(benchmarkReport.overall_resilience_score || 80).toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  {benchmarkReport.passed_tests || 0} PASS / {benchmarkReport.failed_tests || 0} FAIL
                </div>
              </div>

              <div className="p-3.5 bg-hawkins-panel border border-hawkins-border rounded-xl">
                <div className="text-[10px] font-mono text-zinc-400 mb-0.5">CONTAINMENT STATE</div>
                <div className="text-base font-bold font-mono text-hawkins-amber uppercase mt-1">
                  {benchmarkReport.hawkins_status || 'CONTAINED'}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  TOTAL TESTS: {benchmarkReport.total_tests || 0}
                </div>
              </div>
            </div>

            {/* Terminal Live Stream */}
            <TerminalLogs
              logs={logs}
              onClearLogs={() => setLogs(["// Terminal output cleared."])}
              isStreaming={isRunningTest}
            />

            {/* Action Bar */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsReportOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-hawkins-card hover:bg-zinc-800 text-zinc-200 border border-hawkins-border font-mono text-xs font-semibold transition-all"
              >
                <FileText className="w-4 h-4 text-hawkins-amber" />
                <span>DECLASSIFIED AUDIT REPORT</span>
              </button>
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-hawkins-crimson hover:bg-hawkins-blood text-white shadow-glow-red font-mono text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>SYNTHESIZE NEW VECTOR</span>
              </button>
            </div>

          </div>
        </section>

        {/* Section 2: Active Test Chamber */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-hawkins-crimson animate-pulse" />
              <h2 className="text-sm font-mono font-bold uppercase text-zinc-300 tracking-wider">
                SENSORY DEPRIVATION CHAMBER // ACTIVE TEST RUNNER
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              TARGET: {selectedScenario?.title || 'Active Target'}
            </span>
          </div>

          <TestChamber
            scenario={selectedScenario}
            onRunTest={handleRunTest}
            isRunning={isRunningTest}
            latestEvaluation={latestEvaluation}
          />
        </section>

        {/* Section 3: The 10 Adversarial Dimensions (Sectors) */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>THE 10 ADVERSARIAL DIMENSIONS</span>
                <span className="text-xs font-normal text-zinc-400 font-mono">
                  (Click any sector to inspect & stress-test)
                </span>
              </h2>
            </div>

            {/* Filter by Category & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search attack vectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-hawkins-panel border border-hawkins-border pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono text-zinc-200 outline-none focus:border-hawkins-crimson w-48"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-hawkins-panel border border-hawkins-border px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 outline-none cursor-pointer"
              >
                <option value="all">All 10 Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 10 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const score = benchmarkReport.categories?.[cat.id];
              const isSelected = selectedCategory === cat.id;

              return (
                <CategoryCard
                  key={cat.id}
                  meta={cat}
                  score={score}
                  isSelected={isSelected}
                  onSelect={() => handleSelectCategory(cat.id)}
                  onQuickRun={() => handleQuickRunSector(cat.id)}
                />
              );
            })}
          </div>

          {/* Seed Scenarios List for the Selected Category */}
          <div className="mt-6 p-5 bg-hawkins-panel border border-hawkins-border rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-hawkins-border mb-3">
              <div className="text-xs font-mono font-bold text-zinc-200">
                SCENARIOS IN {(selectedCategory || 'ambiguity').replace('_', ' ').toUpperCase()} ({filteredScenarios.length} AVAILABLE)
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Select a scenario to load into the Test Chamber
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredScenarios.map((scen) => {
                const isActive = selectedScenario?.id === scen.id;
                return (
                  <div
                    key={scen.id}
                    onClick={() => {
                      setSelectedScenario(scen);
                      document.getElementById('test-chamber')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-hawkins-card border-hawkins-crimson shadow-glow-red ring-1 ring-hawkins-crimson'
                        : 'bg-hawkins-dark hover:bg-zinc-900 border-hawkins-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-semibold text-hawkins-amber uppercase">
                        {scen.category}
                      </span>
                      <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {scen.threat_level || 'HIGH'}
                      </span>
                    </div>
                    <h4 className="text-xs font-mono font-bold text-zinc-100 line-clamp-1 mb-1">
                      {scen.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 font-mono">
                      {scen.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-hawkins-border/50 text-[10px] font-mono">
                      <span className="text-zinc-500">{(scen.tags || []).join(', ')}</span>
                      <span className="text-hawkins-crimson font-bold">LOAD ➔</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-hawkins-border/80 bg-hawkins-panel py-6 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>HAWKINS NATIONAL LABORATORY // DEPT OF ENERGY // RESTRICTED ACCESS</span>
          <span>LANGGRAPH • GROQ • FASTAPI • REACT // 24-HOUR HACKATHON BENCHMARK</span>
        </div>
      </footer>

      {/* Dynamic Generator Modal */}
      <DynamicGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onScenarioGenerated={(newScenario) => {
          setScenarios((prev) => [newScenario, ...prev]);
          setSelectedScenario(newScenario);
          setSelectedCategory(newScenario.category);
          setLogs((prev) => [
            ...prev,
            `✓ [The Void] Dynamic scenario generated and loaded: "${newScenario.title}"`
          ]);
          document.getElementById('test-chamber')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={benchmarkReport}
      />

    </div>
  );
};

export default App;
