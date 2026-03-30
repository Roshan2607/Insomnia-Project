'use client'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import StepShell from './StepShell'
import Card from '@/components/ui/Card'
import Slider from '@/components/ui/Slider'

export default function Step2Sleep() {
  const router = useRouter()
  const { data, setField } = useAssessmentStore()

  return (
    <StepShell
      step={2}
      title={<><em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">Sleep</em> patterns</>}
      subtitle="// nightly duration and self-rated quality"
      onNext={() => router.push('/assess/step/3')}
    >
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          <Slider id="sleep_duration" label="Sleep Duration" unit="hrs"
            value={data.sleep_duration} min={1} max={12} step={0.5}
            onChange={(v) => setField('sleep_duration', v)} />
          <Slider id="quality_of_sleep" label="Sleep Quality" unit="/ 10"
            value={data.quality_of_sleep} min={1} max={10} step={1}
            onChange={(v) => setField('quality_of_sleep', v)} />
        </div>
      </Card>
    </StepShell>
  )
}
