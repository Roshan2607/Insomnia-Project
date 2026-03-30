import type { AssessmentData, PredictResponse } from './types'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function checkHealth(): Promise<{ model_loaded: boolean }> {
  const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) })
  return res.json()
}

export async function predict(data: AssessmentData): Promise<PredictResponse> {
  const payload = {
    age:              data.age,
    sleep_duration:   data.sleep_duration,
    quality_of_sleep: data.quality_of_sleep,
    physical_activity:data.physical_activity,
    stress_level:     data.stress_level,
    daily_steps:      data.daily_steps,
    heart_rate:       data.heart_rate,
    ecg_heart_rate:   data.ecg_heart_rate,
    ecg_qrs_duration: data.ecg_qrs_duration,
    systolic:         data.systolic,
    diastolic:        data.diastolic,
    eeg_alpha:        data.eeg_alpha,
    eeg_beta:         data.eeg_beta,
    eeg_theta:        data.eeg_theta,
    emg_mean:         data.emg_mean,
    emg_max:          data.emg_max,
    ecf_na:           data.ecf_na,
    ecf_k:            data.ecf_k,
    bmi_normal:       data.bmi === 'normal'      ? 1 : 0,
    bmi_overweight:   data.bmi === 'overweight'  ? 1 : 0,
    bmi_obese:        data.bmi === 'obese'       ? 1 : 0,
    gender_male:      data.gender === 'male'     ? 1 : 0,
    gender_female:    data.gender === 'female'   ? 1 : 0,
    ...[1,2,3,4,5,6,7].reduce((acc, i) => {
      const val = data[`isi_${i}` as keyof AssessmentData]
      if (val !== undefined) acc[`isi_${i}`] = val
      return acc
    }, {} as Record<string, number>),
  }

  const res = await fetch(`${API}/predict`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }

  return res.json()
}
