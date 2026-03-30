# InsomnAI — Backend

Insomnia risk detection using behavioral & lifestyle features (no wearable required).

## Setup

```bash
cd insomnia_backend
pip install -r requirements.txt
```

## Step 1 — Add your dataset

Drop the Kaggle CSV here:
```
data/raw/sleep.csv
```
Dataset: https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset

## Step 2 — Train the model

```bash
python -m src.train --data data/raw/sleep.csv
```

This trains 5 classifiers, prints a comparison table, and saves the best one to `models/pipeline.pkl`.

## Step 3 — Run the API

```bash
uvicorn api.main:app --reload
```

API is live at http://localhost:8000  
Interactive docs at http://localhost:8000/docs

## Step 4 — Test it

```bash
# Run tests
pytest tests/

# Or hit the API directly
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35, "sleep_duration": 5.0, "quality_of_sleep": 4,
    "physical_activity": 20, "stress_level": 9, "heart_rate": 80,
    "daily_steps": 4000, "systolic": 130, "diastolic": 85,
    "bmi_overweight": 1, "gender_male": 1
  }'
```

## API Endpoints

| Method | Endpoint    | Description                        |
|--------|-------------|------------------------------------|
| GET    | /health     | Check if model is loaded           |
| POST   | /predict    | Get insomnia risk score            |
| GET    | /features   | List all features + ISI questions  |

## Project Structure

```
insomnia_backend/
├── data/raw/              ← drop CSV here
├── src/
│   ├── features.py        ← FEATURE_COLS (single source of truth)
│   ├── preprocess.py      ← data cleaning + train/test split
│   ├── train.py           ← model training + evaluation
│   └── predict.py         ← inference + SHAP explanations
├── api/
│   ├── main.py            ← FastAPI app
│   └── schemas.py         ← Pydantic request/response models
├── models/
│   └── pipeline.pkl       ← saved after training
├── tests/
│   └── test_predict.py
└── requirements.txt
```
