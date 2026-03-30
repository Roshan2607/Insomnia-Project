import logging
import joblib
import numpy as np
import pandas as pd
import shap
from pathlib import Path
from src.features import FEATURE_COLS, CLINICALLY_IMPLAUSIBLE_ZERO

logger = logging.getLogger(__name__)

# Weight given to ISI questionnaire score when blending with model probability.
# 0.0 = ignore ISI entirely, 1.0 = ignore model entirely.
ISI_BLEND_WEIGHT = 0.4


class InsomniaPredictor:
    def __init__(self, model_path: str = "models/pipeline.pkl"):
        path = Path(model_path)
        if not path.exists():
            raise FileNotFoundError(
                f"Model not found at {model_path}. Run src.train first."
            )
        saved = joblib.load(path)
        self.pipeline = saved["pipeline"]
        self.threshold = saved["threshold"]
        self.clf = self.pipeline.named_steps["clf"]
        self.scaler = self.pipeline.named_steps["scaler"]
        self._explainer = shap.TreeExplainer(self.clf)

    def _parse_shap(self, shap_values: np.ndarray) -> np.ndarray:
        """
        Normalise SHAP output to a flat 1-D array of per-feature values
        for the positive class, regardless of SHAP / model version.

        Possible shapes coming in:
          - (n_classes, n_samples, n_features)  — newer SHAP + multi-output
          - (n_samples, n_features)              — binary, single sample
          - (n_features,)                        — already flat
        """
        sv = np.array(shap_values)
        if sv.ndim == 3:
            # (classes, samples, features) — take class-1, sample-0
            sv = sv[1][0]
        elif sv.ndim == 2:
            # (samples, features) — take sample-0
            sv = sv[0]
        return sv.flatten()

    def predict(self, raw_input: dict, isi_total: int = None) -> dict:
        # Warn on fields where 0 is likely wrong
        missing = [
            col for col in CLINICALLY_IMPLAUSIBLE_ZERO
            if raw_input.get(col, None) in (None, 0)
        ]
        if missing:
            logger.warning(
                "Implausible or missing zero values for: %s — defaulting to 0. "
                "Predictions may be unreliable.",
                missing,
            )

        row = {col: raw_input.get(col, 0) for col in FEATURE_COLS}
        X = pd.DataFrame([row], columns=FEATURE_COLS)
        X_scaled = self.scaler.transform(X)
        proba = self.clf.predict_proba(X_scaled)[0][1]

        if isi_total is not None:
            isi_normalized = isi_total / 28.0
            proba = (1 - ISI_BLEND_WEIGHT) * proba + ISI_BLEND_WEIGHT * isi_normalized

        sv = self._parse_shap(self._explainer.shap_values(X_scaled))

        feature_impacts = sorted(
            zip(FEATURE_COLS, sv.tolist()),
            key=lambda x: abs(x[1]),
            reverse=True,
        )[:3]
        top_factors = [
            {"feature": f, "impact": round(v, 4)} for f, v in feature_impacts
        ]

        label = (
            "High Risk" if proba >= 0.7
            else "Moderate Risk" if proba >= 0.4
            else "Low Risk"
        )
        return {
            "insomnia_risk": round(float(proba), 4),
            "prediction": label,
            "top_factors": top_factors,
        }


def compute_isi_score(isi_answers: dict) -> dict:
    total = sum(isi_answers.get(f"isi_{i}", 0) for i in range(1, 8))
    if total <= 7:
        severity = "No clinically significant insomnia"
    elif total <= 14:
        severity = "Sub-threshold insomnia"
    elif total <= 21:
        severity = "Moderate clinical insomnia"
    else:
        severity = "Severe clinical insomnia"
    return {"isi_total": total, "isi_severity": severity}