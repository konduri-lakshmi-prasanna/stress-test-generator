# Project Adversary — AI Hallucination Stress-Test Generator
> Automated system generating adversarial evaluation scenarios targeting model weaknesses, hallucinations, and evidence gaps across 10 failure categories.

---

## 🎯 Executive Overview
Conventional AI benchmarks evaluate models on clean, well-formed questions. In the real world, models stumble on **ambiguous questions, conflicting information, false assumptions, missing evidence, and prompt injections**.

**Project Adversary** automatically generates balanced adversarial tests, evaluates model responses, and highlights exactly where an AI can and cannot be trusted.

---

## 🚀 How to Run in 3 Simple Steps

### Step 1: Start the Backend (Terminal 1)
```powershell
cd backend
python run.py
```
> FastAPI backend runs on `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

### Step 2: Start the Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
> React Vite frontend runs on `http://localhost:5173`.

### Step 3: Open Your Browser
Go to **`http://localhost:5173`**:
1. **Enter your topic or context** (e.g., *"Refund Policy"*, *"Apollo 11 Mission"*, or upload a text file).
2. **Click `Generate & Run Tests`**.
3. **Review the results**: Inspect summary cards, category performance bars, and expandable test cards showing AI responses and plain-English explanations.

---

## 🔬 The 10 Adversarial Categories Covered Internally

1. **Ambiguity**: Does the model clarify unclear questions or make wild assumptions?
2. **Contradiction**: Does it detect conflicting facts in the supplied context?
3. **False Premise**: Does it challenge unfounded or incorrect assumptions?
4. **Evidence Gap**: Does it admit when evidence is missing rather than hallucinating?
5. **Misleading Context**: Does it recognize inaccuracies in provided text?
6. **Fabricated Citations**: Does it refuse to invent fake academic DOIs or legal cases?
7. **Multi-Step Reasoning**: Does it reach conclusions supported by multiple facts?
8. **Paraphrase Consistency**: Does its stance remain invariant when wording changes?
9. **Prompt Injection**: Does it resist malicious instructions embedded in content?
10. **Outdated Information**: Does it distinguish current facts from outdated data?

---

## 💡 Key Features for Beginners & Judges
- **One-Click Execution**: No manual category juggling required. One click automatically distributes diverse tests across categories.
- **Plain-English Explanations**: Understandable messages (e.g., *"The AI answered without enough evidence"*, *"The AI caught conflicting statements"*).
- **Clear Status Badges**: **PASS** (green), **FAIL** (red), and **NEEDS REVIEW** (amber).
- **Expandable Cards**: View the full prompt, actual AI response, evidence analysis, and recommended improvements.
- **Export Capabilities**: 1-click export to **CSV**, **PDF/Print**, or **Markdown**.
- **Live Groq API & Demo Fallback**: Configure your Groq key under Settings for live real-time LLM inference, or run in Demo Mode with local simulation.
