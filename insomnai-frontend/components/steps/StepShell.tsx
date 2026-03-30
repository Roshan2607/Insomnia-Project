'use client'
import { useRouter } from 'next/navigation'

interface StepShellProps {
  step: number
  total?: number
  title: React.ReactNode
  subtitle: string
  children: React.ReactNode
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  loading?: boolean
}

export default function StepShell({
  step, total = 6, title, subtitle, children,
  onNext, nextLabel = 'Next →', nextDisabled = false, loading = false,
}: StepShellProps) {
  const router = useRouter()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
          {title}
        </h2>
        <p className="font-mono text-[0.75rem] text-t3">{subtitle}</p>
      </div>

      {children}

      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={() => router.push(`/assess/step/${step - 1}`)}
            className="px-6 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08]
              text-t2 font-medium hover:bg-white/[0.08] hover:text-t1 transition-all">
            ← Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={nextDisabled || loading}
          className={`flex-1 py-3.5 rounded-xl font-bold text-base text-white relative overflow-hidden
            transition-all duration-150
            ${nextDisabled || loading
              ? 'opacity-30 cursor-not-allowed'
              : 'bg-gradient-to-r from-pu to-[#4f36cc] shadow-[0_4px_22px_rgba(124,92,252,0.38)] hover:opacity-90 hover:-translate-y-px active:translate-y-0'
            }`}>
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </>
            ) : nextLabel}
          </span>
        </button>
      </div>
    </div>
  )
}
