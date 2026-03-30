'use client'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import StepShell from './StepShell'
import Card from '@/components/ui/Card'
import Stepper from '@/components/ui/Stepper'
import Chips from '@/components/ui/Chips'

const GENDER_OPTIONS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]
const BMI_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'overweight', label: 'Overweight' },
  { value: 'obese', label: 'Obese' },
]

export default function Step1Profile() {
  const router = useRouter()
  const { data, setField } = useAssessmentStore()
  const valid = data.gender !== '' && data.bmi !== ''

  return (
    <StepShell
      step={1} title={<>Your <em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">profile</em></>}
      subtitle="// demographics · age · biological factors"
      onNext={() => router.push('/assess/step/2')}
      nextDisabled={!valid}
    >
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stepper id="age" label="Age" value={data.age} min={10} max={100} unit="yrs"
            onChange={(v) => setField('age', v)} />
          <div className="sm:col-span-2">
            <Chips name="gender" label="Gender" options={GENDER_OPTIONS}
              value={data.gender} onChange={(v) => setField('gender', v as 'male' | 'female')} />
          </div>
          <div className="sm:col-span-3">
            <Chips name="bmi" label="BMI Category" options={BMI_OPTIONS}
              value={data.bmi} onChange={(v) => setField('bmi', v as 'normal' | 'overweight' | 'obese')} />
          </div>
        </div>
      </Card>
      {!valid && (
        <p className="text-[0.75rem] font-mono text-t3 mt-1">
          Select gender and BMI to continue
        </p>
      )}
    </StepShell>
  )
}
