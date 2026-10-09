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
  is_fallback?: boolean;
  fallback_details?: string | null;
  developer_feedback?: string | null;
  prompt_patch?: string | null;
  architecture_fix?: string | null;
  was_fallback_answer?: boolean;
  fallback_action_details?: string | null;
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

export interface DeveloperActionItem {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  issue: string;
  action: string;
  prompt_fix: string;
}

export interface SuiteRunResponse {
  execution_mode: 'LIVE_API' | 'DEMO_SIMULATION' | 'FALLBACK_ENGAGED';
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
  fallback_message?: string | null;
  fallback_action_taken?: string | null;
  developer_action_plan?: DeveloperActionItem[];
  recommended_system_prompt?: string | null;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'fallback';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  timestamp: string;
  duration?: number;
}

export interface ActionFeedbackLog {
  id: string;
  actionName: string;
  status: 'SUCCESS' | 'FALLBACK_ENGAGED' | 'WARNING';
  timestamp: string;
  details: string;
  fallbackActionTaken?: string;
}

export interface TargetModelInfo {
  id: string;
  name: string;
  category: 'Groq Cloud (LPU)' | 'OpenAI' | 'Google DeepMind' | 'Anthropic';
  provider: string;
  speed: string;
  context: string;
  description: string;
}

export const AVAILABLE_TARGET_MODELS: TargetModelInfo[] = [
  // 1. Groq Cloud (Exactly 2 models as requested)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq Llama-3.3 70B (Frontier)',
    category: 'Groq Cloud (LPU)',
    provider: 'Groq',
    speed: '280 t/s',
    context: '128k',
    description: 'Meta flagship frontier open-weight model hosted on Groq high-speed LPUs.'
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Groq Llama-3.1 8B (Fast)',
    category: 'Groq Cloud (LPU)',
    provider: 'Groq',
    speed: '800+ t/s',
    context: '128k',
    description: 'Blazing-fast 8B parameter model running natively on Groq LPUs.'
  },

  // 2. OpenAI
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o (Omni Flagship)',
    category: 'OpenAI',
    provider: 'OpenAI',
    speed: 'High Precision',
    context: '128k',
    description: 'OpenAI premier omni-modal foundation model with advanced reasoning.'
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini (Fast)',
    category: 'OpenAI',
    provider: 'OpenAI',
    speed: 'Fast Efficient',
    context: '128k',
    description: 'Lightweight, affordable high-speed OpenAI model for daily tasks.'
  },

  // 3. Google DeepMind
  {
    id: 'gemini-1.5-pro',
    name: 'Google Gemini 1.5 Pro',
    category: 'Google DeepMind',
    provider: 'Google DeepMind',
    speed: 'Deep Context',
    context: '1M tokens',
    description: 'Google frontier multimodal model with breakthrough million-token context window.'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Google Gemini 1.5 Flash',
    category: 'Google DeepMind',
    provider: 'Google DeepMind',
    speed: 'Ultra Fast',
    context: '1M tokens',
    description: 'Optimized high-frequency model from Google for speed and efficiency.'
  },

  // 4. Anthropic
  {
    id: 'claude-3-5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    category: 'Anthropic',
    provider: 'Anthropic',
    speed: 'Nuanced Reasoning',
    context: '200k',
    description: 'Anthropic industry-leading frontier model for nuanced comprehension and coding.'
  },
  {
    id: 'claude-3-haiku',
    name: 'Anthropic Claude 3 Haiku',
    category: 'Anthropic',
    provider: 'Anthropic',
    speed: 'Fast Lightweight',
    context: '200k',
    description: 'Compact high-speed intelligence model from Anthropic.'
  }
];
