'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import { predict } from '@/lib/api'
import StepShell from './StepShell'
import Card from '@/components/ui/Card'

const ISI_QUESTIONS = [
  'Difficulty falling asleep',
  'Difficulty staying asleep',
  'Waking up too early',
  'Sleep satisfaction (0 = very satisfied)',
  'Noticeable to others',
  'Worried about sleep',
  'Interferes with daily life',
]

type ISIKey = 'isi_1'|'isi_2'|'isi_3'|'isi_4'|'isi_5'|'isi_6'|'isi_7'

export default function Step6ISI() {
  const router = useRouter()
  const { data, setField, setResult } = useAssessmentStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await predict(data)
      setResult(result)
      router.push('/results')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepShell
      step={6}
      title={<>Sleep <em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">questionnaire</em></>}
      subtitle="// ISI · optional · blended 40% with model score · rate 0 (none) to 4 (severe)"
      onNext={handleSubmit}
      nextLabel="Analyze →"
      loading={loading}
    >
      <Card>
        <div className="divide-y divide-white/[0.05]">
          {ISI_QUESTIONS.map((q, i) => {
            const key = `isi_${i + 1}` as ISIKey
            const val = data[key] as number | undefined

            return (
              <div key={i} className="flex items-center justify-between py-3.5 gap-4 first:pt-0 last:pb-0">
                <span className="text-[0.82rem] text-t1 flex-1">{q}</span>
                <div className="flex gap-1.5 flex-shrink-0">
                  {[0, 1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      onClick={() => setField(key, v)}
                      className={`w-8 h-8 rounded-lg font-mono text-[0.72rem] border transition-all duration-150
                        ${val === v
                          ? 'bg-pu border-pu text-white shadow-[0_0_10px_rgba(124,92,252,0.5)]'
                          : 'border-white/[0.08] text-t3 hover:border-pu hover:text-pul'
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {error && (
        <div className="mt-3 px-4 py-3 bg-hi/[0.07] border border-hi/20 rounded-xl
          font-mono text-[0.78rem] text-hi">
          Error: {error}
        </div>
      )}

      <p className="mt-3 text-[0.72rem] font-mono text-t3">
        ISI is optional — skip any questions you prefer not to answer
      </p>
    </StepShell>
  )
}
