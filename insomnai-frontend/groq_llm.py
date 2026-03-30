"""
Drop-in replacement for Ollama — uses Groq's free API with llama3.
Sign up at https://console.groq.com and grab a free API key.
Set env var: GROQ_API_KEY=your_key_here

Usage in api/main.py — replace your ollama call with:
    from api.groq_llm import get_llm_summary
    summary = get_llm_summary(prediction, insomnia_risk, top_factors)
"""

import os
import httpx
from typing import Optional

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama3-8b-8192"  # free tier, same model as your Ollama setup


def get_llm_summary(
    prediction: str,
    insomnia_risk: float,
    top_factors: list[dict],
    isi_severity: Optional[str] = None,
) -> Optional[str]:
    """
    Generate a 3-sentence clinical summary using Groq's llama3.
    Returns None if GROQ_API_KEY is not set or the request fails.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    pct = round(insomnia_risk * 100)
    factors_text = ", ".join(
        f"{f['feature'].replace('_', ' ')} ({'+' if f['impact'] > 0 else ''}{f['impact']:.3f})"
        for f in top_factors[:5]
    )
    isi_line = f"ISI severity: {isi_severity}. " if isi_severity else ""

    prompt = (
        f"A patient has been assessed for insomnia risk. "
        f"ML prediction: {prediction} ({pct}% risk). "
        f"{isi_line}"
        f"Top contributing factors: {factors_text}. "
        f"Write a concise 3-sentence clinical sleep assessment. "
        f"Sentence 1: summarise the pattern. "
        f"Sentence 2: identify the most likely physiological or behavioural cause. "
        f"Sentence 3: give one actionable recommendation. "
        f"Be direct and clinical. Do not use bullet points."
    )

    try:
        response = httpx.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
                "temperature": 0.4,
            },
            timeout=15.0,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[Groq] LLM error: {e}")
        return None
