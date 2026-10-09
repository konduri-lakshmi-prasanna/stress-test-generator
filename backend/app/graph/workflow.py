from langgraph.graph import StateGraph, END
from app.graph.state import AdversarialGraphState
from app.graph.nodes import (
    generate_scenario_node,
    execute_target_node,
    deterministic_scan_node,
    llm_judge_node
)

def create_adversarial_graph():
    """Constructs and compiles the multi-agent LangGraph workflow for adversarial evaluation."""
    workflow = StateGraph(AdversarialGraphState)

    # Register Nodes
    workflow.add_node("scenario_generator", generate_scenario_node)
    workflow.add_node("target_runner", execute_target_node)
    workflow.add_node("heuristic_scanner", deterministic_scan_node)
    workflow.add_node("adversarial_judge", llm_judge_node)

    # Establish Workflow Edges
    workflow.set_entry_point("scenario_generator")
    workflow.add_edge("scenario_generator", "target_runner")
    workflow.add_edge("target_runner", "heuristic_scanner")
    workflow.add_edge("heuristic_scanner", "adversarial_judge")
    workflow.add_edge("adversarial_judge", END)

    return workflow.compile()

# Pre-compiled instance
adversarial_pipeline = create_adversarial_graph()
