'use client'

interface StepperProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (v: number) => void
  onInfo?: () => void
}

export default function Stepper({ id, label, value, min, max, unit, onChange, onInfo }: StepperProps) {
  const nudge = (d: number) =>
    onChange(Math.min(max, Math.max(min, value + d)))

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-[0.7rem] font-medium text-t2 uppercase tracking-wider">
          {label}
        </label>
        {unit && <span className="text-[0.6rem] text-t3">{unit}</span>}
        {onInfo && (
          <button onClick={onInfo}
            className="w-4 h-4 rounded-full border border-t3 text-t3 text-[0.6rem]
              flex items-center justify-center hover:border-pul hover:text-pul
              hover:bg-pud transition-all ml-auto">
            i
          </button>
        )}
      </div>
      <div className="flex items-center bg-black/20 border border-white/[0.08] rounded-lg overflow-hidden">
        <button onClick={() => nudge(-1)}
          className="w-9 h-10 text-t2 hover:text-pul hover:bg-pud transition-all text-lg font-light">
          −
        </button>
        <input
          type="number"
          id={id}
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent text-center font-mono text-sm text-white outline-none py-2"
        />
        <button onClick={() => nudge(1)}
          className="w-9 h-10 text-t2 hover:text-pul hover:bg-pud transition-all text-lg font-light">
          +
        </button>
      </div>
    </div>
  )
}
