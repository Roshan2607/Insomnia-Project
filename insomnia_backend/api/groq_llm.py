import os
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"


def get_llm_summary(
    prediction: str,
    insomnia_risk: float,
    top_factors: list[dict],
    isi_severity: Optional[str] = None,
) -> Optional[str]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.warning("GROQ_API_KEY not set — skipping LLM summary")
        return None

    pct = round(insomnia_risk * 100)
    factors_text = ", ".join(
        f"{f['feature'].replace('_', ' ')} ({'elevated' if f['impact'] > 0 else 'low'})"
        for f in top_factors[:5]
    )
    isi_line = (
        f" ISI questionnaire indicates {isi_severity}." if isi_severity else ""
    )

    prompt = (
        f"You are a clinical sleep specialist. A patient has been assessed for insomnia risk.\n\n"
        f"Risk level: {prediction}\n"
        f"Top contributing factors: {factors_text}{isi_line}\n\n"
        f"Respond with exactly 3 bullet points:\n"
        f"• What the key signals suggest about the patient's sleep pattern.\n"
        f"• What the likely underlying cause is based on the top factors.\n"
        f"• One specific, actionable recommendation.\n\n"
        f"Be direct, empathetic, and avoid medical jargon. "
        f"Do not use 'our' or 'we'. Do not mention a risk percentage."
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
    except httpx.HTTPStatusError as e:
        logger.error("[Groq] HTTP error %s: %s", e.response.status_code, e)
        return None
    except Exception as e:
        logger.error("[Groq] Unexpected error: %s", e)
        return None