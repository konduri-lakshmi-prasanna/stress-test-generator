from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CategoryEnum(str, Enum):
    AMBIGUITY = "ambiguity"
    CONTRADICTION = "contradiction"
    FALSE_PREMISE = "false_premise"
    EVIDENCE_GAP = "evidence_gap"
    MISLEADING_CONTEXT = "misleading_context"
    FABRICATED_CITATIONS = "fabricated_citations"
    MULTI_STEP_REASONING = "multi_step_reasoning"
    PARAPHRASE_CONSISTENCY = "paraphrase_consistency"
    PROMPT_INJECTION = "prompt_injection"
    OUTDATED_INFORMATION = "outdated_information"

class ThreatLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    UPSIDE_DOWN = "UPSIDE_DOWN"

class TestStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    NEEDS_REVIEW = "NEEDS_REVIEW"

class CategoryMeta(BaseModel):
    id: CategoryEnum
    name: str
    code_name: str
    question: str
    description: str
    threat_level: ThreatLevel
    evaluation_criteria: str

class AdversarialScenario(BaseModel):
    id: str
    category: CategoryEnum
    title: str
    description: str
    context: Optional[str] = None
    attack_prompt: str
    baseline_prompt: Optional[str] = None
    expected_behavior: str
    failure_signals: List[str] = Field(default_factory=list)
    threat_level: ThreatLevel = ThreatLevel.HIGH
    tags: List[str] = Field(default_factory=list)

class ScenarioGenerationRequest(BaseModel):
    category: CategoryEnum
    domain: Optional[str] = "General Knowledge"
    threat_level: Optional[ThreatLevel] = ThreatLevel.HIGH
    custom_instructions: Optional[str] = None
    api_key: Optional[str] = None

class TargetRunRequest(BaseModel):
    scenario_id: Optional[str] = None
    custom_scenario: Optional[AdversarialScenario] = None
    target_model: Optional[str] = "llama-3.1-8b-instant"
    judge_model: Optional[str] = "llama-3.3-70b-versatile"
    api_key: Optional[str] = None

class HeuristicCheckResult(BaseModel):
    flagged: bool
    reasons: List[str] = Field(default_factory=list)
    signals_detected: List[str] = Field(default_factory=list)

class EvaluationResult(BaseModel):
    id: str
    scenario_id: str
    scenario_title: str
    category: CategoryEnum
    target_model: str
    prompt_used: str
    context_used: Optional[str] = None
    model_response: str
    passed: bool
    score: float = Field(ge=0, le=100)  # 0 to 100 resilience score
    vulnerability_detected: bool
    vulnerability_type: Optional[str] = None
    judge_reasoning: str
    heuristic_results: HeuristicCheckResult
    recommendation: str
    timestamp: str
    # Simplified user-friendly fields
    status: str = "PASS"  # PASS, FAIL, NEEDS_REVIEW
    plain_explanation: Optional[str] = None
    evidence_or_detected_issue: Optional[str] = None
    expected_behavior: Optional[str] = None
    is_simulated: bool = False
    is_fallback: bool = False
    fallback_details: Optional[str] = None
    developer_feedback: Optional[str] = None
    prompt_patch: Optional[str] = None
    architecture_fix: Optional[str] = None
    was_fallback_answer: bool = False
    fallback_action_details: Optional[str] = None

class CategoryScore(BaseModel):
    category: CategoryEnum
    name: str
    passed_count: int
    failed_count: int
    needs_review_count: int = 0
    total_tests: int
    avg_score: float
    threat_status: str

class BenchmarkReport(BaseModel):
    overall_resilience_score: float  # 0 to 100 (Higher is safer)
    mind_flayer_index: float        # 0 to 100 (Vulnerability index = 100 - resilience)
    total_tests: int
    passed_tests: int
    failed_tests: int
    needs_review_tests: int = 0
    categories: Dict[str, CategoryScore]
    recent_evaluations: List[EvaluationResult] = Field(default_factory=list)
    hawkins_status: str             # "CONTAINED", "PARTIAL BREACH", "UPSIDE DOWN INVASION"

class SuiteRunRequest(BaseModel):
    topic_or_context: str
    target_model: Optional[str] = "llama-3.1-8b-instant"
    test_count: Optional[int] = 5
    api_key: Optional[str] = None

class SuiteRunResponse(BaseModel):
    execution_mode: str  # "LIVE_API" or "DEMO_SIMULATION" or "FALLBACK_ENGAGED"
    topic: str
    target_model: str
    total_tests: int
    passed_tests: int
    failed_tests: int
    needs_review_tests: int
    reliability_score: float
    results: List[EvaluationResult]
    category_performance: Dict[str, Dict[str, Any]]
    common_failure_types: List[str]
    recommended_improvements: List[str]
    fallback_message: Optional[str] = None
    fallback_action_taken: Optional[str] = None
    developer_action_plan: List[Dict[str, Any]] = Field(default_factory=list)
    recommended_system_prompt: Optional[str] = None
