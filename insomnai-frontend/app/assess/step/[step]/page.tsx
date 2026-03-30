import { notFound } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import Step1Profile    from '@/components/steps/Step1Profile'
import Step2Sleep      from '@/components/steps/Step2Sleep'
import Step3Lifestyle  from '@/components/steps/Step3Lifestyle'
import Step4Cardio     from '@/components/steps/Step4Cardio'
import Step5BioSignals from '@/components/steps/Step5BioSignals'
import Step6ISI        from '@/components/steps/Step6ISI'

const STEPS: Record<number, React.ComponentType> = {
  1: Step1Profile,
  2: Step2Sleep,
  3: Step3Lifestyle,
  4: Step4Cardio,
  5: Step5BioSignals,
  6: Step6ISI,
}

export default async function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params
  const stepNum = parseInt(step)
  const StepComponent = STEPS[stepNum]
  if (!StepComponent) notFound()

  return (
    <>
      <ProgressBar current={stepNum} />
      <main className="max-w-3xl mx-auto px-6 py-10 pb-24 animate-fade-up">
        <StepComponent />
      </main>
    </>
  )
}

export function generateStaticParams() {
  return [1, 2, 3, 4, 5, 6].map((s) => ({ step: String(s) }))
}
