FEATURE_COLS = [
    "age",
    "sleep_duration",
    "quality_of_sleep",
    "physical_activity",
    "stress_level",
    "daily_steps",
    "heart_rate",
    "ecg_heart_rate",
    "ecg_qrs_duration",
    "systolic",
    "diastolic",
    "eeg_alpha",
    "eeg_beta",
    "eeg_theta",
    "emg_mean",
    "emg_max",
    "ecf_na",
    "ecf_k",
    "bmi_normal",
    "bmi_overweight",
    "bmi_obese",
    "gender_male",
    "gender_female",
]

TARGET_COL = "insomnia"

ISI_QUESTIONS = [
    {"id": "isi_1", "text": "Difficulty falling asleep", "min": 0, "max": 4},
    {"id": "isi_2", "text": "Difficulty staying asleep", "min": 0, "max": 4},
    {"id": "isi_3", "text": "Problem waking up too early", "min": 0, "max": 4},
    {"id": "isi_4", "text": "How satisfied are you with your sleep?", "min": 0, "max": 4},
    {"id": "isi_5", "text": "How noticeable is your sleep problem to others?", "min": 0, "max": 4},
    {"id": "isi_6", "text": "How worried are you about your sleep?", "min": 0, "max": 4},
    {"id": "isi_7", "text": "How much does sleep interfere with daily functioning?", "min": 0, "max": 4},
]

# Fields where 0 is not a valid fallback — used for imputation warnings
CLINICALLY_IMPLAUSIBLE_ZERO = {
    "stress_level", "quality_of_sleep", "heart_rate", "ecg_heart_rate",
    "eeg_alpha", "eeg_beta", "eeg_theta", "emg_mean", "emg_max",
    "ecf_na", "ecf_k",
}