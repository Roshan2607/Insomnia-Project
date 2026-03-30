import argparse
import joblib
import json
import logging
from pathlib import Path

import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold, train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, classification_report, roc_auc_score,
)
from xgboost import XGBClassifier

from src.preprocess import load_and_preprocess

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# Logistic regression is included as a linear baseline for benchmarking only.
# The best model is always selected from TREE_MODELS.
MODELS = {
    "logistic_regression": LogisticRegression(
        max_iter=1000, class_weight="balanced", random_state=42
    ),
    "random_forest": RandomForestClassifier(
        n_estimators=300, class_weight="balanced", random_state=42
    ),
    "gradient_boosting": GradientBoostingClassifier(
        n_estimators=200, random_state=42
    ),
    # use_label_encoder removed (deprecated in XGBoost >= 1.6)
    "xgboost": XGBClassifier(
        n_estimators=200,
        scale_pos_weight=3,
        eval_metric="logloss",
        random_state=42,
    ),
}

TREE_MODELS = {"random_forest", "gradient_boosting", "xgboost"}


def best_threshold(model, X_val, y_val) -> tuple[float, float]:
    """Find the threshold that maximises F1 on a held-out validation set."""
    probs = model.predict_proba(X_val)[:, 1]
    best_t, best_f1 = 0.5, 0.0
    for t in np.arange(0.2, 0.8, 0.01):
        preds = (probs >= t).astype(int)
        f = f1_score(y_val, preds, zero_division=0)
        if f > best_f1:
            best_f1, best_t = f, t
    return round(best_t, 2), round(best_f1, 4)


def evaluate(model, X_test, y_test, threshold: float = 0.5) -> dict:
    probs = model.predict_proba(X_test)[:, 1]
    y_pred = (probs >= threshold).astype(int)
    return {
        "accuracy":  round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
        "recall":    round(recall_score(y_test, y_pred, zero_division=0), 4),
        "f1":        round(f1_score(y_test, y_pred, zero_division=0), 4),
        "roc_auc":   round(roc_auc_score(y_test, probs), 4),
        "threshold": threshold,
    }


def train(csv_path: str, model_dir: str = "models"):
    Path(model_dir).mkdir(exist_ok=True)

    # Three-way split: train / val (threshold tuning) / test (final eval)
    X_train_full, X_test, y_train_full, y_test = load_and_preprocess(csv_path)
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_full, y_train_full,
        test_size=0.2,
        stratify=y_train_full,
        random_state=42,
    )
    logger.info(
        "Split sizes — train: %d, val: %d, test: %d",
        len(X_train), len(X_val), len(X_test),
    )

    results = {}
    all_pipelines = {}
    all_thresholds = {}
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, clf in MODELS.items():
        logger.info("── Training %s ──", name)
        pipe = Pipeline([("scaler", MinMaxScaler()), ("clf", clf)])
        pipe.fit(X_train, y_train)

        # Tune threshold on val set to avoid leakage into test metrics
        t, _ = best_threshold(pipe, X_val, y_val)
        metrics = evaluate(pipe, X_test, y_test, threshold=t)

        cv_scores = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="f1")
        metrics["cv_f1_mean"] = round(cv_scores.mean(), 4)
        metrics["cv_f1_std"] = round(cv_scores.std(), 4)

        results[name] = metrics
        all_pipelines[name] = pipe
        all_thresholds[name] = t

        logger.info(
            "   Threshold: %s | F1: %s | Recall: %s | ROC-AUC: %s",
            t, metrics["f1"], metrics["recall"], metrics["roc_auc"],
        )
        probs = pipe.predict_proba(X_test)[:, 1]
        y_pred = (probs >= t).astype(int)
        print(classification_report(y_test, y_pred, target_names=["Not Insomnia", "Insomnia"]))

    tree_results = {n: results[n] for n in TREE_MODELS if n in results}
    best_name = max(tree_results, key=lambda n: tree_results[n]["roc_auc"])
    best_metrics = tree_results[best_name]
    best_thresh = all_thresholds[best_name]

    logger.info(
        "✅ Best model: %s | F1=%s | ROC-AUC=%s | Threshold=%s",
        best_name, best_metrics["f1"], best_metrics["roc_auc"], best_thresh,
    )

    out = {"pipeline": all_pipelines[best_name], "threshold": best_thresh}
    joblib.dump(out, Path(model_dir) / "pipeline.pkl")

    with open(Path(model_dir) / "results.json", "w") as f:
        json.dump(
            {"best": best_name, "threshold": best_thresh, "scores": results},
            f, indent=2,
        )
    logger.info("📊 Saved to %s/pipeline.pkl", model_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/raw/sleep.csv")
    parser.add_argument("--model-dir", default="models")
    args = parser.parse_args()
    train(args.data, args.model_dir)