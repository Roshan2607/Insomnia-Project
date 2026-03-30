export interface AssessmentData {
  // Profile
  age: number
  gender: 'male' | 'female' | ''
  bmi: 'normal' | 'overweight' | 'obese' | ''

  // Sleep
  sleep_duration: number
  quality_of_sleep: number

  // Lifestyle
  stress_level: number
  physical_activity: number
  daily_steps: number

  // Cardiovascular
  heart_rate: number
  ecg_heart_rate: number
  ecg_qrs_duration: number
  systolic: number
  diastolic: number

  // Bio-signals
  eeg_alpha: number
  eeg_beta: number
  eeg_theta: number
  emg_mean: number
  emg_max: number
  ecf_na: number
  ecf_k: number

  // ISI questionnaire (optional, 1–7)
  isi_1?: number
  isi_2?: number
  isi_3?: number
  isi_4?: number
  isi_5?: number
  isi_6?: number
  isi_7?: number
}

export interface TopFactor {
  feature: string
  impact: number
}

export interface PredictResponse {
  prediction: string
  insomnia_risk: number
  top_factors: TopFactor[]
  nlp_report: string | null
  isi_total: number | null
  isi_severity: string | null
}

export const STEP_LABELS = [
  'Profile',
  'Sleep',
  'Lifestyle',
  'Cardio',
  'Bio-signals',
  'Questionnaire',
]

export const TOTAL_STEPS = 6
