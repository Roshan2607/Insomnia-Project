'use client'
import Link from 'next/link'
import { STEP_LABELS } from '@/lib/types'

export default function ProgressBar({ current }: { current: number }) {
  return (
    <div className="bg-white/[0.02] border-b border-white/[0.05] px-6 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-0">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isDone    = stepNum < current
          const isActive  = stepNum === current

          return (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <Link
                href={isDone ? `/assess/step/${stepNum}` : '#'}
                className={`flex items-center gap-2 transition-opacity duration-200
                  ${isActive ? 'opacity-100' : isDone ? 'opacity-60 hover:opacity-80' : 'opacity-25 pointer-events-none'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center
                  font-mono text-[0.65rem] flex-shrink-0 transition-all duration-200
                  ${isActive
                    ? 'bg-pu border border-pu text-white shadow-[0_0_12px_rgba(124,92,252,0.5)]'
                    : isDone
                    ? 'bg-lo border border-lo text-black'
                    : 'border border-t3 text-t3'}`}>
                  {isDone ? '✓' : stepNum}
                </span>
                <span className={`text-[0.7rem] font-medium whitespace-nowrap hidden sm:block
                  ${isActive ? 'text-t1' : 'text-t2'}`}>
                  {label}
                </span>
              </Link>
              {i < STEP_LABELS.length - 1 && (
                <div className="flex-1 h-px bg-white/[0.07] mx-2 min-w-[8px]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
