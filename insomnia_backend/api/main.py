import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

load_dotenv()

from api.groq_llm import get_llm_summary
from api.schemas import UserInput, PredictionResponse
from src.predict import InsomniaPredictor, compute_isi_score

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# Set ALLOWED_ORIGINS in your .env for production.
# Example: ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS: list[str] = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins
    else ["http://localhost:3000", "http://localhost:5173"]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="InsomnAI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

_predictor_error: str | None = None
try:
    predictor = InsomniaPredictor()
except FileNotFoundError as e:
    predictor = None
    _predictor_error = str(e)
    logger.warning("Model not loaded: %s", e)


@app.get("/")
def serve_frontend():
    return FileResponse("index.html")


@app.get("/health")
def health():
    return {
        "status": "ok" if predictor else "degraded",
        "model_loaded": predictor is not None,
        "detail": (
            None if predictor
            else _predictor_error or "Run src.train to generate pipeline.pkl"
        ),
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(user_input: UserInput):
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail=_predictor_error or "Model not loaded. Run src.train first.",
        )

    isi_answers = {
        f"isi_{i}": getattr(user_input, f"isi_{i}")
        for i in range(1, 8)
        if getattr(user_input, f"isi_{i}") is not None
    }
    isi_total = None
    isi_result: dict = {}
    if isi_answers:
        isi_result = compute_isi_score(isi_answers)
        isi_total = isi_result["isi_total"]

    # model_dump() replaces the deprecated .dict() in Pydantic v2
    result = predictor.predict(user_input.model_dump(), isi_total=isi_total)
    result.update(isi_result)

    result["nlp_report"] = get_llm_summary(
        prediction=result["prediction"],
        insomnia_risk=result["insomnia_risk"],
        top_factors=[
            f if isinstance(f, dict) else f.model_dump()
            for f in result["top_factors"]
        ],
        isi_severity=isi_result.get("isi_severity"),
    )

    return result


@app.get("/features")
def list_features():
    from src.features import FEATURE_COLS, ISI_QUESTIONS
    return {"features": FEATURE_COLS, "isi_questions": ISI_QUESTIONS}