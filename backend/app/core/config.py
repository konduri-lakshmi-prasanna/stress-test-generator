import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hawkins Lab // Project Adversary"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Provider API configurations
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY", "")
    
    DEFAULT_GENERATOR_MODEL: str = "llama-3.3-70b-versatile"
    DEFAULT_JUDGE_MODEL: str = "llama-3.3-70b-versatile"
    DEFAULT_TARGET_MODEL: str = "llama-3.1-8b-instant"
    
    # Supported Multi-Provider Models (2 Groq + OpenAI, Google Gemini, Anthropic Claude)
    SUPPORTED_TARGET_MODELS: list = [
        # 1. Groq Cloud (Exactly 2 models as requested)
        {"id": "llama-3.3-70b-versatile", "name": "Groq Llama-3.3 70B (Frontier)", "provider": "Groq", "category": "Groq Cloud (LPU)", "speed": "Fast (280 t/s)", "context": "128k"},
        {"id": "llama-3.1-8b-instant", "name": "Groq Llama-3.1 8B (Fast)", "provider": "Groq", "category": "Groq Cloud (LPU)", "speed": "Blazing (800+ t/s)", "context": "128k"},
        
        # 2. OpenAI
        {"id": "gpt-4o", "name": "OpenAI GPT-4o (Omni Flagship)", "provider": "OpenAI", "category": "OpenAI", "speed": "High Precision", "context": "128k"},
        {"id": "gpt-4o-mini", "name": "OpenAI GPT-4o Mini (Fast)", "provider": "OpenAI", "category": "OpenAI", "speed": "Fast Efficient", "context": "128k"},
        
        # 3. Google DeepMind
        {"id": "gemini-1.5-pro", "name": "Google Gemini 1.5 Pro", "provider": "Google DeepMind", "category": "Google DeepMind", "speed": "Deep Context", "context": "1M tokens"},
        {"id": "gemini-1.5-flash", "name": "Google Gemini 1.5 Flash", "provider": "Google DeepMind", "category": "Google DeepMind", "speed": "Ultra Fast", "context": "1M tokens"},
        
        # 4. Anthropic
        {"id": "claude-3-5-sonnet", "name": "Anthropic Claude 3.5 Sonnet", "provider": "Anthropic", "category": "Anthropic", "speed": "Nuanced Reasoning", "context": "200k"},
        {"id": "claude-3-haiku", "name": "Anthropic Claude 3 Haiku", "provider": "Anthropic", "category": "Anthropic", "speed": "Fast Lightweight", "context": "200k"}
    ]
    
    # Fallback / Demo simulation flag if API key isn't provided or rate limited
    ENABLE_SIMULATION_FALLBACK: bool = True
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
