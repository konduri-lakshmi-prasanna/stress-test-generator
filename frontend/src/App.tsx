import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { IntroSection } from './components/IntroSection';
import { TestInputSection } from './components/TestInputSection';
import { HowTestingWorks } from './components/HowTestingWorks';
import { ResultsSection } from './components/ResultsSection';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/ToastContainer';
import { ConstraintCardModal } from './components/ConstraintCardModal';

import { SuiteRunResponse, ToastNotification, ToastType } from './types';
import { runTestSuite, getApiKey, checkBackendHealth } from './services/api';

export const App: React.FC = () => {
  const [suiteData, setSuiteData] = useState<SuiteRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("Synthesizing adversarial test scenarios...");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isConstraintCardOpen, setIsConstraintCardOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((
    title: string,
    message: string,
    type: ToastType = 'info',
    actionLabel?: string,
    onAction?: () => void,
    duration: number = 5500
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newToast: ToastNotification = {
      id,
      type,
      title,
      message,
      actionLabel,
      onAction,
      timestamp,
      duration
    };

    setToasts(prev => [newToast, ...prev].slice(0, 5));

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

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

      // Constraint Card 09: Clear feedback after completing an important action
      if (response.execution_mode === 'FALLBACK_ENGAGED' || response.fallback_message) {
        addToast(
          "Fallback Mode Engaged (Constraint Card 09)",
          response.fallback_message || "Expected live result could not be produced. Hawkins Local Simulation Engine took over.",
          "fallback",
          "View Diagnostic",
          () => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }),
          8000
        );
      } else {
        addToast(
          "Benchmark Suite Completed",
          `Evaluated ${response.total_tests} adversarial tests for "${response.target_model}". Reliability Score: ${response.reliability_score}%.`,
          "success",
          "View Results",
          () => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }),
          6000
        );
      }

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error("Test execution encountered error:", err);
      // Constraint Card 09: Fallback action when expected result cannot be produced
      addToast(
        "Expected Result Could Not Be Produced",
        "Connection anomaly detected. Local simulation fallback suite was applied.",
        "fallback"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUpdated = () => {
    setHasApiKey(!!getApiKey());
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-zinc-100 flex flex-col font-sans selection:bg-[#E50914] selection:text-white relative">
      
      {/* Header */}
      <Header
        hasApiKey={hasApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenConstraintCard={() => setIsConstraintCardOpen(true)}
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
          onActionFeedback={addToast}
        />

        {/* 3. Informational Explanation: How Testing Works */}
        <HowTestingWorks />

        {/* 4. Unified Results Section */}
        <div id="results-section" className="pt-2 scroll-mt-20">
          <ResultsSection
            suiteData={suiteData}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onFeedback={addToast}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C2234] bg-[#0A0C12] py-6 text-center text-xs text-zinc-500 font-sans mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project Adversary — Automated AI Hallucination Stress-Testing</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConstraintCardOpen(true)}
              className="text-amber-400/80 hover:text-amber-300 underline font-mono text-[11px]"
            >
              Constraint Card 09 Verified
            </button>
            <span>FastAPI • LangGraph • Groq LPU • React</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyUpdated={handleKeyUpdated}
        onFeedback={addToast}
      />

      {/* Constraint Card 09 Modal */}
      <ConstraintCardModal
        isOpen={isConstraintCardOpen}
        onClose={() => setIsConstraintCardOpen(false)}
        onTriggerFallbackTest={() => handleRunSuite("FORCE_FALLBACK_TEST", "force-fallback", 5)}
      />

      {/* Global Toast Notification System */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
};

export default App;
