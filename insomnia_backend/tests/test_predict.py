"""
test_predict.py
───────────────
Basic sanity tests — run with: pytest tests/
(requires a trained model at models/pipeline.pkl)
"""

import pytest
from src.predict import InsomniaPredictor, compute_isi_score


# ── ISI score tests (no model needed) ────────────────────────────────────────

def test_isi_no_insomnia():
    result = compute_isi_score({f"isi_{i}": 0 for i in range(1, 8)})
    assert result["isi_total"] == 0
    assert "No clinically" in result["isi_severity"]


def test_isi_severe():
    result = compute_isi_score({f"isi_{i}": 4 for i in range(1, 8)})
    assert result["isi_total"] == 28
    assert "Severe" in result["isi_severity"]


# ── Predictor tests (requires trained model) ─────────────────────────────────

@pytest.fixture(scope="module")
def predictor():
    try:
        return InsomniaPredictor()
    except FileNotFoundError:
        pytest.skip("Model not trained yet — run src/train.py first")


def test_predict_returns_valid_structure(predictor):
    result = predictor.predict({
        "age": 35, "sleep_duration": 5.0, "quality_of_sleep": 4,
        "physical_activity": 20, "stress_level": 9, "heart_rate": 80,
        "daily_steps": 4000, "systolic": 130, "diastolic": 85,
        "bmi_overweight": 1, "gender_male": 1,
    })
    assert "insomnia_risk" in result
    assert 0 <= result["insomnia_risk"] <= 1
    assert result["prediction"] in ("Low Risk", "Moderate Risk", "High Risk")
    assert len(result["top_factors"]) == 3


def test_predict_all_zeros(predictor):
    result = predictor.predict({})
    assert "insomnia_risk" in result
