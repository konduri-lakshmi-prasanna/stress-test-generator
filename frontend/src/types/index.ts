export type CategoryId =
  | 'ambiguity'
  | 'contradiction'
  | 'false_premise'
  | 'evidence_gap'
  | 'misleading_context'
  | 'fabricated_citations'
  | 'multi_step_reasoning'
  | 'paraphrase_consistency'
  | 'prompt_injection'
  | 'outdated_information';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UPSIDE_DOWN';

export type TestStatus = 'PASS' | 'FAIL' | 'NEEDS_REVIEW';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  code_name: string;
  question: string;
  description: string;
  threat_level: ThreatLevel;
  evaluation_criteria: string;
}

export interface AdversarialScenario {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  context?: string | null;
  attack_prompt: string;
  baseline_prompt?: string | null;
  expected_behavior: string;
  failure_signals: string[];
  threat_level: ThreatLevel;
  tags: string[];
}

export interface HeuristicCheckResult {
  flagged: boolean;
  reasons: string[];
  signals_detected: string[];
}

export interface EvaluationResult {
  id: string;
  scenario_id: string;
  scenario_title: string;
  category: CategoryId;
  target_model: string;
  prompt_used: string;
  context_used?: string | null;
  model_response: string;
  passed: boolean;
  score: number;
  vulnerability_detected: boolean;
  vulnerability_type?: string | null;
  judge_reasoning: string;
  heuristic_results: HeuristicCheckResult;
  recommendation: string;
  timestamp: string;
  // User-friendly beginner fields
  status: TestStatus;
  plain_explanation?: string | null;
  evidence_or_detected_issue?: string | null;
  expected_behavior?: string | null;
  is_simulated?: boolean;
}

export interface CategoryScore {
  category: CategoryId;
  name: string;
  passed_count: number;
  failed_count: number;
  needs_review_count?: number;
  total_tests: number;
  avg_score: number;
  threat_status: string;
}

export interface BenchmarkReport {
  overall_resilience_score: number;
  mind_flayer_index: number;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  needs_review_tests?: number;
  categories: Record<string, CategoryScore>;
  recent_evaluations: EvaluationResult[];
  hawkins_status: string;
}

export interface SuiteRunRequest {
  topic_or_context: string;
  target_model?: string;
  test_count?: number;
  api_key?: string;
}

export interface CategoryPerformanceItem {
  name: string;
  total: number;
  passed: number;
  failed: number;
  needs_review: number;
  score: number;
}

export interface SuiteRunResponse {
  execution_mode: 'LIVE_API' | 'DEMO_SIMULATION';
  topic: string;
  target_model: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  needs_review_tests: number;
  reliability_score: number;
  results: EvaluationResult[];
  category_performance: Record<string, CategoryPerformanceItem>;
  common_failure_types: string[];
  recommended_improvements: string[];
}
