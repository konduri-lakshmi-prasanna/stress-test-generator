import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IntroSection } from './components/IntroSection';
import { TestInputSection } from './components/TestInputSection';
import { HowTestingWorks } from './components/HowTestingWorks';
import { ResultsSection } from './components/ResultsSection';
import { SettingsModal } from './components/SettingsModal';

import { SuiteRunResponse } from './types';
import { runTestSuite, getApiKey, checkBackendHealth } from './services/api';

export const App: React.FC = () => {
  const [suiteData, setSuiteData] = useState<SuiteRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("Synthesizing adversarial test scenarios...");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const key = getApiKey();
    setHasApiKey(!!key);
    checkBackendHealth().then((health) => {
      if (health.groq_configured) {
        setHasApiKey(true);
      }
    });
  }, []);

  const handleRunSuite = async (topic: string, targetModel: string, testCount: number) => {
    setIsLoading(true);
    setLoadingStep("Synthesizing test scenarios across diverse categories...");

    try {
      // Step interval animation for realistic visual feedback
      const timer1 = setTimeout(() => {
        setLoadingStep(`Running target model (${targetModel}) across generated scenarios...`);
      }, 1200);

      const timer2 = setTimeout(() => {
        setLoadingStep("Evaluating evidence, scanning contradictions, and grading reliability...");
      }, 2500);

      const response = await runTestSuite({
        topic_or_context: topic,
        target_model: targetModel,
        test_count: testCount,
        api_key: getApiKey() || undefined
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      setSuiteData(response);

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error("Test execution failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUpdated = () => {
    setHasApiKey(!!getApiKey());
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-zinc-100 flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
      
      {/* Header */}
      <Header
        hasApiKey={hasApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        executionMode={suiteData?.execution_mode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        
        {/* 1. Value Proposition & Steps */}
        <IntroSection />

        {/* 2. Main Input Card */}
        <TestInputSection
          onRunSuite={handleRunSuite}
          isLoading={isLoading}
          loadingStep={loadingStep}
        />

        {/* 3. Informational Explanation: How Testing Works */}
        <HowTestingWorks />

        {/* 4. Unified Results Section */}
        <div id="results-section" className="pt-2 scroll-mt-20">
          <ResultsSection
            suiteData={suiteData}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C2234] bg-[#0A0C12] py-6 text-center text-xs text-zinc-500 font-sans mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project Adversary — Automated AI Hallucination Stress-Testing</span>
          <span>FastAPI • LangGraph • Groq Llama 3.3 & 3.1 • React</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyUpdated={handleKeyUpdated}
      />

    </div>
  );
};

export default App;
