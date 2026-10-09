from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.schemas import (
    CategoryEnum,
    AdversarialScenario,
    HeuristicCheckResult,
    EvaluationResult,
    ThreatLevel
)

class AdversarialGraphState(BaseModel):
    category: Optional[CategoryEnum] = None
    domain: Optional[str] = "General"
    scenario: Optional[AdversarialScenario] = None
    target_model: str = "llama-3.1-8b-instant"
    judge_model: str = "llama-3.3-70b-versatile"
    api_key: Optional[str] = None
    
    # Execution telemetry
    target_response: Optional[str] = None
    heuristic_results: Optional[HeuristicCheckResult] = None
    evaluation_result: Optional[EvaluationResult] = None
    
    # Step-by-step logs
    execution_logs: List[str] = Field(default_factory=list)
    error: Optional[str] = None
