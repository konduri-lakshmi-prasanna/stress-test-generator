import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hawkins Lab // Project Adversary"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Groq API configuration
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", "")
    DEFAULT_GENERATOR_MODEL: str = "llama-3.3-70b-versatile"
    DEFAULT_JUDGE_MODEL: str = "llama-3.3-70b-versatile"
    DEFAULT_TARGET_MODEL: str = "llama-3.1-8b-instant"
    
    # Fallback / Demo simulation flag if API key isn't provided or rate limited
    ENABLE_SIMULATION_FALLBACK: bool = True
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
