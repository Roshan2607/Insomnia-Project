from pydantic import BaseModel, Field
from typing import Optional, List


class UserInput(BaseModel):
    age:               float = Field(..., ge=0, le=120)
    sleep_duration:    float = Field(..., ge=0, le=24)
    quality_of_sleep:  float = Field(..., ge=1, le=10)
    physical_activity: float = Field(..., ge=0)
    stress_level:      float = Field(..., ge=1, le=10)
    daily_steps:       float = Field(..., ge=0)
    heart_rate:        float = Field(..., ge=30, le=200)
    ecg_heart_rate:    float = Field(..., ge=30, le=200)
    ecg_qrs_duration:  float = Field(..., ge=0)
    systolic:          float = Field(..., ge=50, le=250)
    diastolic:         float = Field(..., ge=30, le=150)
    eeg_alpha:         float = Field(..., ge=0)
    eeg_beta:          float = Field(..., ge=0)
    eeg_theta:         float = Field(..., ge=0)
    emg_mean:          float = Field(..., ge=0)
    emg_max:           float = Field(..., ge=0)
    ecf_na:            float = Field(...)
    ecf_k:             float = Field(...)
    bmi_normal:        int   = Field(0, ge=0, le=1)
    bmi_overweight:    int   = Field(0, ge=0, le=1)
    bmi_obese:         int   = Field(0, ge=0, le=1)
    gender_male:       int   = Field(0, ge=0, le=1)
    gender_female:     int   = Field(0, ge=0, le=1)
    isi_1: Optional[int] = Field(None, ge=0, le=4)
    isi_2: Optional[int] = Field(None, ge=0, le=4)
    isi_3: Optional[int] = Field(None, ge=0, le=4)
    isi_4: Optional[int] = Field(None, ge=0, le=4)
    isi_5: Optional[int] = Field(None, ge=0, le=4)
    isi_6: Optional[int] = Field(None, ge=0, le=4)
    isi_7: Optional[int] = Field(None, ge=0, le=4)

    model_config = {"populate_by_name": True}


class FactorItem(BaseModel):
    feature: str
    impact:  float


class PredictionResponse(BaseModel):
    insomnia_risk: float
    prediction:    str
    top_factors:   List[FactorItem]
    isi_total:     Optional[int] = None
    isi_severity:  Optional[str] = None
    nlp_report:    Optional[str] = None