'use client'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import StepShell from './StepShell'
import Card from '@/components/ui/Card'
import Slider from '@/components/ui/Slider'

export default function Step3Lifestyle() {
  const router = useRouter()
  const { data, setField } = useAssessmentStore()

  return (
    <StepShell
      step={3}
      title={<>Daily <em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">lifestyle</em></>}
      subtitle="// activity, stress, and movement patterns"
      onNext={() => router.push('/assess/step/4')}
    >
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          <Slider id="stress_level" label="Stress Level" unit="/ 10"
            value={data.stress_level} min={1} max={10} step={1}
            onChange={(v) => setField('stress_level', v)} />
          <Slider id="physical_activity" label="Physical Activity" unit="min"
            value={data.physical_activity} min={0} max={120} step={5}
            onChange={(v) => setField('physical_activity', v)} />
          <Slider id="daily_steps" label="Daily Steps"
            value={data.daily_steps} min={0} max={20000} step={500}
            onChange={(v) => setField('daily_steps', v)} />
        </div>
      </Card>
    </StepShell>
  )
}
