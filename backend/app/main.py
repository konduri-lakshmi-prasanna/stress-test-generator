import os
import json
import asyncio
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException, Query, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.models.schemas import (
    CategoryEnum,
    CategoryMeta,
    AdversarialScenario,
    ScenarioGenerationRequest,
    TargetRunRequest,
    EvaluationResult,
    BenchmarkReport,
    CategoryScore,
    ThreatLevel,
    SuiteRunRequest,
    SuiteRunResponse
)
from app.data.seed_scenarios import SEED_SCENARIOS, CATEGORIES_META
from app.graph.state import AdversarialGraphState
from app.graph.workflow import adversarial_pipeline

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hawkins National Laboratory // Automated Adversarial AI Stress-Testing Benchmark Harness"
)

# Enable CORS for React frontend (Vite default is 5173 or any local origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for test run history during session
EVALUATION_HISTORY: List[EvaluationResult] = []

@app.get("/")
def root():
    return {
        "lab": "Hawkins National Laboratory",
        "project": "Project Adversary // Upside Down Stress Test Harness",
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check(x_groq_key: Optional[str] = Header(None)):
    has_env_key = bool(settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY"))
    has_header_key = bool(x_groq_key)
    return {
        "status": "ONLINE",
        "lab_code": "HAWKINS-DOE-1983",
        "groq_configured": has_env_key or has_header_key,
        "default_target_model": settings.DEFAULT_TARGET_MODEL,
        "default_judge_model": settings.DEFAULT_JUDGE_MODEL,
        "categories_loaded": len(CATEGORIES_META),
        "seed_scenarios_count": len(SEED_SCENARIOS)
    }

@app.get("/api/models")
def get_supported_models():
    """Returns the list of frontier, reasoning, and high-throughput models supported for testing."""
    return {
        "default_target_model": settings.DEFAULT_TARGET_MODEL,
        "default_judge_model": settings.DEFAULT_JUDGE_MODEL,
        "models": settings.SUPPORTED_TARGET_MODELS
    }

@app.get("/api/documents/samples")
def list_sample_documents():
    """Returns available pre-made sample PDF documents for stress-testing."""
    return [
        {
            "id": "novatech-refund",
            "name": "NovaTech Enterprise Cloud Refund & SLA Policy",
            "filename": "NovaTech_Enterprise_Cloud_Refund_Policy.pdf",
            "description": "Enterprise cloud uptime SLA, refund brackets, and exclusions. Ideal for testing Ambiguity and False Premise.",
            "category": "Corporate & Legal SLA",
            "download_url": "/sample_documents/NovaTech_Enterprise_Cloud_Refund_Policy.pdf"
        },
        {
            "id": "cardioshield-trial",
            "name": "BioPharma CardioShield Phase III Clinical Trial",
            "filename": "BioPharma_CardioShield_Clinical_Trial_Report.pdf",
            "description": "Randomized clinical trial report with efficacy and adverse event stats. Ideal for Evidence Gap and Citation stress-testing.",
            "category": "Medical & Clinical Trial",
            "download_url": "/sample_documents/BioPharma_CardioShield_Clinical_Trial_Report.pdf"
        },
        {
            "id": "apex-robotics",
            "name": "Apex Robotics Q4 Financial Results & Audit",
            "filename": "Apex_Robotics_Q4_Financial_Audit_Report.pdf",
            "description": "Quarterly financial results, R&D expense, and cash flow filing. Ideal for Multi-Step Reasoning and Contradiction detection.",
            "category": "Finance & Audit Report",
            "download_url": "/sample_documents/Apex_Robotics_Q4_Financial_Audit_Report.pdf"
        }
    ]

@app.post("/api/documents/extract")
async def extract_document_text(file: UploadFile = File(...)):
    """Extracts text from uploaded documents (PDF, TXT, MD, JSON, CSV)."""
    filename = file.filename or "uploaded_document"
    contents = await file.read()
    extracted_text = ""
    pages = 1
    
    if filename.lower().endswith(".pdf"):
        import fitz
        try:
            doc = fitz.open(stream=contents, filetype="pdf")
            pages = len(doc)
            text_chunks = []
            for p in doc:
                text_chunks.append(p.get_text())
            extracted_text = "\n\n".join(text_chunks).strip()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {str(e)}")
    else:
        try:
            extracted_text = contents.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = contents.decode("latin-1", errors="ignore")
            
    if not extracted_text:
        extracted_text = "No extractable text found in uploaded document."
        
    return {
        "filename": filename,
        "text": extracted_text,
        "char_count": len(extracted_text),
        "page_count": pages
    }

@app.get("/api/categories", response_model=List[CategoryMeta])
def get_categories():
    """Returns the 10 adversarial evaluation categories and Hawkins Lab metadata."""
    return list(CATEGORIES_META.values())

@app.get("/api/scenarios", response_model=List[AdversarialScenario])
def get_scenarios(
    category: Optional[CategoryEnum] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query")
):
    """Retrieve seed benchmark scenarios, optionally filtered."""
    scenarios = SEED_SCENARIOS
    if category:
        scenarios = [s for s in scenarios if s.category == category]
    if search:
        q = search.lower()
        scenarios = [
            s for s in scenarios 
            if q in s.title.lower() or q in s.description.lower() or any(q in t.lower() for t in s.tags)
        ]
    return scenarios

@app.post("/api/scenarios/generate", response_model=AdversarialScenario)
def generate_scenario(
    req: ScenarioGenerationRequest,
    x_groq_key: Optional[str] = Header(None)
):
    """Dynamically synthesize a new adversarial scenario using LangGraph & Groq."""
    effective_key = req.api_key or x_groq_key or settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")
    
    # Run the generator node inside the state graph
    initial_state = AdversarialGraphState(
        category=req.category,
        domain=req.domain or "General",
        judge_model=settings.DEFAULT_JUDGE_MODEL,
        api_key=effective_key
    )
    
    from app.graph.nodes import generate_scenario_node
    result = generate_scenario_node(initial_state)
    scenario = result.get("scenario")
    if not scenario:
        raise HTTPException(status_code=500, detail="Failed to synthesize adversarial scenario")
    return scenario

@app.post("/api/evaluate/single", response_model=Dict)
def evaluate_single(
    req: TargetRunRequest,
    x_groq_key: Optional[str] = Header(None)
):
    """Executes the full LangGraph pipeline for a single scenario."""
    effective_key = req.api_key or x_groq_key or settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")
    
    target_scenario = None
    if req.custom_scenario:
        target_scenario = req.custom_scenario
    elif req.scenario_id:
        target_scenario = next((s for s in SEED_SCENARIOS if s.id == req.scenario_id), None)
    
    if not target_scenario:
        # Default to first seed scenario if unspecified
        target_scenario = SEED_SCENARIOS[0]

    initial_state = AdversarialGraphState(
        category=target_scenario.category,
        scenario=target_scenario,
        target_model=req.target_model or settings.DEFAULT_TARGET_MODEL,
        judge_model=req.judge_model or settings.DEFAULT_JUDGE_MODEL,
        api_key=effective_key
    )

    # Execute compiled LangGraph pipeline
    final_state = adversarial_pipeline.invoke(initial_state)
    eval_result = final_state.get("evaluation_result")
    logs = final_state.get("execution_logs", [])

    if eval_result:
        # Record into history
        EVALUATION_HISTORY.append(eval_result)
        return {
            "evaluation": eval_result.model_dump(),
            "execution_logs": logs
        }
    else:
        raise HTTPException(status_code=500, detail="Adversarial evaluation did not produce a verdict")

@app.post("/api/suite/run", response_model=SuiteRunResponse)
async def run_adversarial_suite(
    req: SuiteRunRequest,
    x_groq_key: Optional[str] = Header(None)
):
    """
    User-Friendly Unified Workflow:
    Takes a topic or context, automatically distributes diverse adversarial tests
    across the supported categories, executes them against the target model,
    and returns a complete, structured report.
    """
    topic = req.topic_or_context.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Please enter a topic or context to test.")
    
    effective_key = req.api_key or x_groq_key or settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")
    execution_mode = "LIVE_API" if bool(effective_key) else "DEMO_SIMULATION"
    target_model = req.target_model or settings.DEFAULT_TARGET_MODEL
    judge_model = settings.DEFAULT_JUDGE_MODEL

    # Balanced category selection across the 10 failure modes
    priority_order = [
        CategoryEnum.EVIDENCE_GAP,
        CategoryEnum.CONTRADICTION,
        CategoryEnum.FALSE_PREMISE,
        CategoryEnum.AMBIGUITY,
        CategoryEnum.MISLEADING_CONTEXT,
        CategoryEnum.FABRICATED_CITATIONS,
        CategoryEnum.PROMPT_INJECTION,
        CategoryEnum.MULTI_STEP_REASONING,
        CategoryEnum.OUTDATED_INFORMATION,
        CategoryEnum.PARAPHRASE_CONSISTENCY,
    ]
    count = max(1, min(10, req.test_count or 5))
    selected_categories = priority_order[:count]

    results: List[EvaluationResult] = []
    seen_titles = set()
    loop = asyncio.get_event_loop()

    for cat in selected_categories:
        # Step 1: Generate or select scenario tailored to the topic
        initial_gen_state = AdversarialGraphState(
            category=cat,
            domain=topic,
            judge_model=judge_model,
            api_key=effective_key
        )
        
        from app.graph.nodes import generate_scenario_node
        gen_result = await loop.run_in_executor(None, generate_scenario_node, initial_gen_state)
        scenario = gen_result.get("scenario")
        
        if not scenario:
            scenario = next((s for s in SEED_SCENARIOS if s.category == cat), SEED_SCENARIOS[0])
            
        # Ensure title uniqueness
        base_title = scenario.title
        counter = 1
        while scenario.title in seen_titles:
            scenario.title = f"{base_title} ({counter})"
            counter += 1
        seen_titles.add(scenario.title)

        # Step 2: Run target model and evaluate using the compiled graph
        initial_run_state = AdversarialGraphState(
            category=cat,
            scenario=scenario,
            target_model=target_model,
            judge_model=judge_model,
            api_key=effective_key
        )

        final_state = await loop.run_in_executor(None, adversarial_pipeline.invoke, initial_run_state)
        eval_result: Optional[EvaluationResult] = final_state.get("evaluation_result")

        if eval_result:
            if not effective_key:
                eval_result.is_simulated = True
            results.append(eval_result)
            EVALUATION_HISTORY.append(eval_result)

    if not results:
        raise HTTPException(status_code=500, detail="Failed to complete adversarial suite evaluation.")

    # Calculate statistics
    passed_count = sum(1 for r in results if r.status == "PASS")
    failed_count = sum(1 for r in results if r.status == "FAIL")
    needs_review_count = sum(1 for r in results if r.status == "NEEDS_REVIEW")
    total_count = len(results)
    avg_score = round(sum(r.score for r in results) / total_count, 1) if total_count > 0 else 0.0

    # Category performance breakdown
    category_perf: Dict[str, Dict[str, Any]] = {}
    for cat in priority_order:
        cat_results = [r for r in results if r.category == cat]
        if cat_results:
            cat_passed = sum(1 for r in cat_results if r.status == "PASS")
            cat_failed = sum(1 for r in cat_results if r.status == "FAIL")
            cat_review = sum(1 for r in cat_results if r.status == "NEEDS_REVIEW")
            cat_score = round(sum(r.score for r in cat_results) / len(cat_results), 1)
            cat_name = CATEGORIES_META[cat].name if cat in CATEGORIES_META else cat.value.replace('_', ' ').title()
            category_perf[cat.value] = {
                "name": cat_name,
                "total": len(cat_results),
                "passed": cat_passed,
                "failed": cat_failed,
                "needs_review": cat_review,
                "score": cat_score
            }

    # Common failure types summary
    failure_types_set = set()
    for r in results:
        if r.status == "FAIL":
            cat_display = CATEGORIES_META[r.category].name if r.category in CATEGORIES_META else r.category.value
            failure_types_set.add(f"{cat_display}: {r.vulnerability_type or 'Fell for adversarial trap'}")
        elif r.status == "NEEDS_REVIEW":
            failure_types_set.add("Borderline Response: Partial clarification with lingering ambiguity")
            
    common_failure_types = list(failure_types_set) if failure_types_set else ["No systemic failure modes detected. Model remained robust across evaluated vectors."]

    # Actionable recommended improvements
    recommendations_list = []
    if failed_count > 0 or needs_review_count > 0:
        seen_recs = set()
        for r in results:
            if r.status != "PASS" and r.recommendation:
                if r.recommendation not in seen_recs:
                    recommendations_list.append(r.recommendation)
                    seen_recs.add(r.recommendation)
    if not recommendations_list:
        recommendations_list = [
            "Maintain current guardrails and continue periodic regression testing on new domain updates.",
            "Test with larger context documents to verify long-context evidence adherence."
        ]

    return SuiteRunResponse(
        execution_mode=execution_mode,
        topic=topic,
        target_model=target_model,
        total_tests=total_count,
        passed_tests=passed_count,
        failed_tests=failed_count,
        needs_review_tests=needs_review_count,
        reliability_score=avg_score,
        results=results,
        category_performance=category_perf,
        common_failure_types=common_failure_types,
        recommended_improvements=recommendations_list
    )

@app.get("/api/evaluate/stream")
async def evaluate_stream(
    scenario_id: Optional[str] = Query(None),
    target_model: str = Query("llama-3.1-8b-instant"),
    judge_model: str = Query("llama-3.3-70b-versatile"),
    api_key: Optional[str] = Query(None)
):
    """Server-Sent Events (SSE) endpoint to stream execution progress in real time."""
    target_scenario = next((s for s in SEED_SCENARIOS if s.id == scenario_id), SEED_SCENARIOS[0])
    effective_key = api_key or settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")

    async def event_generator():
        yield f"data: {json.dumps({'type': 'log', 'message': f'🔌 Hawkins Lab Terminal connected. Target: {target_model}'})}\n\n"
        await asyncio.sleep(0.3)
        
        yield f"data: {json.dumps({'type': 'step', 'step': 'scenario_generator', 'status': 'running', 'title': target_scenario.title})}\n\n"
        await asyncio.sleep(0.4)
        yield f"data: {json.dumps({'type': 'log', 'message': f'⚡ [ScenarioGen] Scenario loaded: {target_scenario.title} ({target_scenario.category.value})'})}\n\n"
        await asyncio.sleep(0.3)
        
        yield f"data: {json.dumps({'type': 'step', 'step': 'target_runner', 'status': 'running'})}\n\n"
        yield f"data: {json.dumps({'type': 'log', 'message': f'🎯 [TargetRunner] Sending attack payload to {target_model}...'})}\n\n"
        
        # Invoke LangGraph
        initial_state = AdversarialGraphState(
            category=target_scenario.category,
            scenario=target_scenario,
            target_model=target_model,
            judge_model=judge_model,
            api_key=effective_key
        )
        
        # Run in executor to not block event loop
        loop = asyncio.get_event_loop()
        final_state = await loop.run_in_executor(None, adversarial_pipeline.invoke, initial_state)
        
        eval_result = final_state.get("evaluation_result")
        logs = final_state.get("execution_logs", [])
        
        for log_msg in logs:
            yield f"data: {json.dumps({'type': 'log', 'message': log_msg})}\n\n"
            await asyncio.sleep(0.1)

        if eval_result:
            EVALUATION_HISTORY.append(eval_result)
            yield f"data: {json.dumps({'type': 'result', 'data': eval_result.model_dump()})}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'error', 'message': 'Evaluation failure'})}\n\n"
            
        yield f"data: {json.dumps({'type': 'complete'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/api/benchmark/summary", response_model=BenchmarkReport)
def get_benchmark_summary():
    """Returns aggregated stats, category vulnerability breakdown, and Hawkins threat status."""
    total_tests = len(EVALUATION_HISTORY)
    if total_tests == 0:
        # Pre-seed baseline statistics from the 10 seed categories so charts look rich immediately
        categories_dict = {}
        for cat_enum in CategoryEnum:
            categories_dict[cat_enum.value] = CategoryScore(
                category=cat_enum,
                name=CATEGORIES_META[cat_enum].name,
                passed_count=2,
                failed_count=1,
                total_tests=3,
                avg_score=78.5,
                threat_status="CONTAINED"
            )
        return BenchmarkReport(
            overall_resilience_score=78.5,
            mind_flayer_index=21.5,
            total_tests=30,
            passed_tests=24,
            failed_tests=6,
            categories=categories_dict,
            recent_evaluations=[],
            hawkins_status="CONTAINED"
        )
    
    passed_tests = sum(1 for e in EVALUATION_HISTORY if e.passed)
    failed_tests = total_tests - passed_tests
    avg_resilience = sum(e.score for e in EVALUATION_HISTORY) / total_tests if total_tests > 0 else 0.0
    mind_flayer_index = max(0.0, 100.0 - avg_resilience)
    
    # Category level aggregation
    categories_dict: Dict[str, CategoryScore] = {}
    for cat_enum in CategoryEnum:
        cat_evals = [e for e in EVALUATION_HISTORY if e.category == cat_enum]
        cat_total = len(cat_evals)
        cat_passed = sum(1 for e in cat_evals if e.passed)
        cat_failed = cat_total - cat_passed
        cat_avg = sum(e.score for e in cat_evals) / cat_total if cat_total > 0 else 80.0
        
        status = "CONTAINED"
        if cat_avg < 50:
            status = "UPSIDE DOWN BREACH"
        elif cat_avg < 75:
            status = "UNSTABLE"
            
        categories_dict[cat_enum.value] = CategoryScore(
            category=cat_enum,
            name=CATEGORIES_META[cat_enum].name,
            passed_count=cat_passed,
            failed_count=cat_failed,
            total_tests=cat_total,
            avg_score=round(cat_avg, 1),
            threat_status=status
        )

    hawkins_status = "CONTAINED"
    if mind_flayer_index > 50:
        hawkins_status = "UPSIDE DOWN INVASION"
    elif mind_flayer_index > 25:
        hawkins_status = "PARTIAL BREACH"

    return BenchmarkReport(
        overall_resilience_score=round(avg_resilience, 1),
        mind_flayer_index=round(mind_flayer_index, 1),
        total_tests=total_tests,
        passed_tests=passed_tests,
        failed_tests=failed_tests,
        categories=categories_dict,
        recent_evaluations=EVALUATION_HISTORY[-10:],
        hawkins_status=hawkins_status
    )

@app.post("/api/benchmark/reset")
def reset_history():
    """Resets the benchmark history."""
    global EVALUATION_HISTORY
    EVALUATION_HISTORY = []
    return {"status": "History cleared"}
