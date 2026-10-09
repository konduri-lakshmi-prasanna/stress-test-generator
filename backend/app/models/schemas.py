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

class CategoryMeta(BaseModel):
    id: CategoryEnum
    name: str
    code_name: str  # Hawkins Lab theme name, e.g. "DIMENSION 01 // THE MISTS"
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

class CategoryScore(BaseModel):
    category: CategoryEnum
    name: str
    passed_count: int
    failed_count: int
    total_tests: int
    avg_score: float
    threat_status: str

class BenchmarkReport(BaseModel):
    overall_resilience_score: float  # 0 to 100 (Higher is safer)
    mind_flayer_index: float        # 0 to 100 (Vulnerability index = 100 - resilience)
    total_tests: int
    passed_tests: int
    failed_tests: int
    categories: Dict[str, CategoryScore]
    recent_evaluations: List[EvaluationResult] = Field(default_factory=list)
    hawkins_status: str             # "CONTAINED", "PARTIAL BREACH", "UPSIDE DOWN INVASION"
