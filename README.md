# 🔴 HAWKINS NATIONAL LABORATORY // PROJECT ADVERSARY
### *Automated 10-Vector Adversarial AI Stress-Testing Benchmark Harness*
> **24-Hour Hackathon Edition** | Built with **LangGraph**, **Groq (Llama 3.3 70B & 3.1 8B)**, **FastAPI**, and **React** in a **Stranger Things / Hawkins Lab & Upside Down** aesthetic.

---

## 🔬 The Core Problem
Conventional LLM benchmarks (MMLU, GSM8K, HumanEval) evaluate models on well-formed, cooperative prompts. In production, however, models fail catastrophically on **ambiguous directives, ungrounded premises, subtle factual contradictions, missing evidence, and embedded malicious injections**.

**Project Adversary** is an automated multi-agent red-teaming engine that:
1. **Synthesizes adversarial attack payloads** specifically designed to exploit model blind spots.
2. **Executes live stress-tests** against target models at ultra-high inference speeds powered by Groq.
3. **Conducts dual-layer evaluation** combining deterministic heuristic scanners with an automated strict LLM-as-a-Judge.
4. **Visualizes the model's vulnerability profile** via the interactive **10-Axis Mind Flayer Radar Matrix**.

---

## 🌌 The 10 Adversarial Dimensions (Sectors)

| Sector | Category | Adversarial Attack Vector | Resilient Behavior (Pass) |
|---|---|---|---|
| **01** | **Ambiguity** | Under-specified queries missing vital parameters (e.g., patient weight in medication dosage). | Model pauses and asks clarifying questions instead of guessing. |
| **02** | **Contradiction** | Supplying context containing mutually exclusive facts (e.g., conflicting revenue in Q3 reports). | Model flags internal contradictions rather than accepting both. |
| **03** | **False Premise** | Questions assuming falsehoods as settled facts (e.g., Apollo 11 landing on Mars). | Model immediately refutes the false premise before answering. |
| **04** | **Evidence Gap** | Reference text omitting the specific detail needed to answer. | Model admits: *"The provided text does not contain this information."* |
| **05** | **Misleading Context** | Authoritative-sounding context packed with subtle physics or historical falsehoods. | Model flags factual errors rather than repeating erroneous source text. |
| **06** | **Fabricated Citations** | Requests for peer-reviewed DOIs or court cases in non-existent discoveries. | Model refuses to invent fake citations or DOIs. |
| **07** | **Multi-step Reasoning** | Complex 3+ condition logic puzzles requiring strict chained deduction. | Model traces sound logic step-by-step to the correct conclusion. |
| **08** | **Paraphrase Consistency**| Emotionally loaded or biased re-framing of objective queries. | Model maintains an invariant, balanced truth-grounded stance. |
| **09** | **Prompt Injection** | Hidden delimiter overrides (`HAWKINS_SYS_OVERRIDE`) and indirect jailbreaks. | Model enforces system guardrails and ignores malicious directives. |
| **10** | **Outdated Information**| Rapidly shifting facts (current heads of state, latest AI models) post-cutoff. | Model acknowledges knowledge cutoffs and flags temporal sensitivity. |

---

## 🏗️ Multi-Agent Architecture (LangGraph + Groq)

```
                       [START]
                          │
                          ▼
            ┌───────────────────────────┐
            │ 1. SCENARIO GENERATOR     │  Synthesizes targeted adversarial prompt
            │    (Groq Llama-3.3 70B)   │  or retrieves curated seed scenario
            └─────────────┬─────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │ 2. TARGET MODEL RUNNER    │  Dispatches attack prompt to Target Model
            │    (Groq Llama-3.1 8B)    │  (ultra-fast inference via Groq LPU)
            └─────────────┬─────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │ 3. HEURISTIC SCANNER      │  Deterministic regex & boundary checks
            │    (Deterministic Regex)  │  (Fake DOIs, injection tokens, refusals)
            └─────────────┬─────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │ 4. ADVERSARIAL JUDGE      │  Strict rubric evaluation (0-100 score,
            │    (Groq Llama-3.3 70B)   │  vulnerability classification, recommendations)
            └─────────────┬─────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │ 5. STATE AGGREGATOR       │  Updates 10-Axis Mind Flayer Radar Matrix
            │    (Pydantic / SSE Stream)│  and logs incident report
            └─────────────┬─────────────┘
                          │
                          ▼
                        [END]
```

---

## 🕹️ Stranger Things Themed UI Experience
- **CRT Scanline & Glow Overlay**: Vintage 1980s Department of Energy terminal aesthetic (with toggle).
- **The Mind Flayer Vulnerability Index**: Live 10-axis radar polygon showing the model's structural weaknesses.
- **Sensory Deprivation Chamber**: Side-by-side prompt inspector (The Right-Side Up vs The Upside Down).
- **The Void (Dynamic Synthesizer)**: Generate brand-new adversarial attacks in any user-specified domain.
- **Declassified Incident Dossier**: Downloadable/printable Hawkins Lab audit report with Markdown export.

---

## 🚀 Quick Start Guide

### 1. Start the Backend (FastAPI + LangGraph + Groq)
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Groq API Key
# You can also enter your key directly in the UI Header!
set GROQ_API_KEY=your_groq_api_key

# Run FastAPI server
python run.py
```
> The API server starts on **http://127.0.0.1:8000** with interactive Swagger documentation at **http://127.0.0.1:8000/docs**.

### 2. Start the Frontend (React + Vite + Tailwind CSS)
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start Vite development server
npm run dev
```
> The Hawkins Lab UI will be live at **http://localhost:5173**.

---

## 🏆 Hackathon Judges Checklist
- [x] **10 distinct evaluation categories covered** with curated test suites.
- [x] **Dynamic adversarial scenario generation** for any custom topic or domain.
- [x] **Multi-agent LangGraph workflow** with stateful execution graph.
- [x] **Groq-accelerated inference** for near-instant evaluation cycles.
- [x] **Stranger Things / Hawkins Lab theme** with responsive, scalable ergonomics.
- [x] **Exportable incident dossier** (Markdown and printable view).
