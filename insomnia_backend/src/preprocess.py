import logging
import pandas as pd
from sklearn.model_selection import train_test_split
from src.features import FEATURE_COLS, TARGET_COL

logger = logging.getLogger(__name__)

COLUMN_REMAP = {
    "physical_activity_level": "physical_activity",
    "physical_activity":       "physical_activity",
    "ecg_heartrate":           "ecg_heart_rate",
    "ecg heart rate":          "ecg_heart_rate",
    "ecg_heart_rate":          "ecg_heart_rate",
    "ecg qrs duration":        "ecg_qrs_duration",
    "eeg alpha":               "eeg_alpha",
    "eeg beta":                "eeg_beta",
    "eeg theta":               "eeg_theta",
    "emg mean":                "emg_mean",
    "emg max":                 "emg_max",
    "ecf na":                  "ecf_na",
    "ecf k":                   "ecf_k",
}

# Features that are not present in the base sleep dataset and are filled
# with 0 as a known limitation. These should ideally come from wearable /
# lab inputs in a real deployment.
SYNTHETIC_FEATURES = {
    "ecg_heart_rate", "ecg_qrs_duration",
    "eeg_alpha", "eeg_beta", "eeg_theta",
    "emg_mean", "emg_max",
    "ecf_na", "ecf_k",
}


def load_and_preprocess(
    csv_path: str,
    test_size: float = 0.3,
    random_state: int = 42,
):
    df = pd.read_csv(csv_path)
    df.columns = (
        df.columns.str.strip().str.lower()
        .str.replace(r"[\s/]+", "_", regex=True)
    )
    df.rename(columns=COLUMN_REMAP, inplace=True)
    logger.info("[preprocess] Columns found: %s", df.columns.tolist())

    df[TARGET_COL] = (
        df["sleep_disorder"].str.strip() == "Insomnia"
    ).astype(int)
    logger.info(
        "[preprocess] Class balance:\n%s", df[TARGET_COL].value_counts()
    )

    if "blood_pressure" in df.columns:
        bp = df["blood_pressure"].str.split("/", expand=True).astype(int)
        df["systolic"] = bp[0]
        df["diastolic"] = bp[1]

    if "bmi_category" in df.columns:
        df["bmi_normal"] = (
            df["bmi_category"].str.lower() == "normal"
        ).astype(int)
        df["bmi_overweight"] = (
            df["bmi_category"].str.lower() == "overweight"
        ).astype(int)
        df["bmi_obese"] = (
            df["bmi_category"].str.lower() == "obese"
        ).astype(int)

    if "gender" in df.columns:
        df["gender_male"] = (
            df["gender"].str.lower() == "male"
        ).astype(int)
        df["gender_female"] = (
            df["gender"].str.lower() == "female"
        ).astype(int)

    missing = [c for c in FEATURE_COLS if c not in df.columns]
    if missing:
        synthetic = [c for c in missing if c in SYNTHETIC_FEATURES]
        unexpected = [c for c in missing if c not in SYNTHETIC_FEATURES]
        if synthetic:
            logger.info(
                "[preprocess] Synthetic/wearable features not in CSV "
                "(filled with 0, expected): %s",
                synthetic,
            )
        if unexpected:
            logger.warning(
                "[preprocess] Unexpected missing features (filled with 0): %s",
                unexpected,
            )
        for col in missing:
            df[col] = 0

    X = df[FEATURE_COLS].copy().apply(pd.to_numeric, errors="coerce")
    y = df[TARGET_COL].copy()

    mask = X.notna().all(axis=1)
    n_dropped = (~mask).sum()
    if n_dropped:
        logger.warning(
            "[preprocess] Dropped %d rows with NaN after coercion.", n_dropped
        )
    X, y = X[mask], y[mask]
    logger.info("[preprocess] Remaining rows: %d", len(X))

    return train_test_split(
        X, y,
        test_size=test_size,
        stratify=y,
        random_state=random_state,
    )