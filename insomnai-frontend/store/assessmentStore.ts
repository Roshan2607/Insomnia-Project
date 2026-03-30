import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssessmentData, PredictResponse } from '@/lib/types'

interface AssessmentStore {
  data: AssessmentData
  result: PredictResponse | null
  setField: <K extends keyof AssessmentData>(key: K, value: AssessmentData[K]) => void
  setResult: (result: PredictResponse) => void
  reset: () => void
}

const defaults: AssessmentData = {
  age: 30,
  gender: '',
  bmi: '',
  sleep_duration: 7,
  quality_of_sleep: 5,
  stress_level: 5,
  physical_activity: 30,
  daily_steps: 7000,
  heart_rate: 72,
  ecg_heart_rate: 74,
  ecg_qrs_duration: 95,
  systolic: 120,
  diastolic: 80,
  eeg_alpha: 8.5,
  eeg_beta: 15,
  eeg_theta: 5,
  emg_mean: 0.3,
  emg_max: 1.2,
  ecf_na: 140,
  ecf_k: 4.2,
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      data: { ...defaults },
      result: null,
      setField: (key, value) =>
        set((s) => ({ data: { ...s.data, [key]: value } })),
      setResult: (result) => set({ result }),
      reset: () => set({ data: { ...defaults }, result: null }),
    }),
    { name: 'insomnai-assessment' }
  )
)
