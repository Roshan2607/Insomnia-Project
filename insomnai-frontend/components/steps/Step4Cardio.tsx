'use client'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import StepShell from './StepShell'
import Card from '@/components/ui/Card'
import Slider from '@/components/ui/Slider'
import Stepper from '@/components/ui/Stepper'

export default function Step4Cardio() {
  const router = useRouter()
  const { data, setField } = useAssessmentStore()

  return (
    <StepShell
      step={4}
      title={<><em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">Cardiovascular</em> metrics</>}
      subtitle="// heart rate and blood pressure readings"
      onNext={() => router.push('/assess/step/5')}
    >
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          <Slider id="heart_rate" label="Heart Rate" unit="bpm"
            value={data.heart_rate} min={40} max={120} step={1}
            onChange={(v) => setField('heart_rate', v)} />
          <Slider id="ecg_heart_rate" label="ECG Heart Rate" unit="bpm"
            value={data.ecg_heart_rate} min={40} max={120} step={1}
            onChange={(v) => setField('ecg_heart_rate', v)} />
          <Slider id="ecg_qrs_duration" label="QRS Duration" unit="ms"
            value={data.ecg_qrs_duration} min={60} max={160} step={1}
            onChange={(v) => setField('ecg_qrs_duration', v)} />
          <Stepper id="systolic" label="Systolic BP" unit="mmHg"
            value={data.systolic} min={80} max={200}
            onChange={(v) => setField('systolic', v)} />
          <Stepper id="diastolic" label="Diastolic BP" unit="mmHg"
            value={data.diastolic} min={50} max={130}
            onChange={(v) => setField('diastolic', v)} />
        </div>
      </Card>
    </StepShell>
  )
}
