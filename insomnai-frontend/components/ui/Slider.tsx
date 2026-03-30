'use client'
import { useCallback } from 'react'

interface SliderProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
  onInfo?: () => void
}

export default function Slider({ id, label, value, min, max, step, unit, onChange, onInfo }: SliderProps) {
  const pct = ((value - min) / (max - min) * 100).toFixed(1) + '%'

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }, [onChange])

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="text-[0.7rem] font-medium text-t2 uppercase tracking-wider">
            {label}
          </label>
          {onInfo && (
            <button onClick={onInfo}
              className="w-4 h-4 rounded-full border border-t3 text-t3 text-[0.6rem]
                flex items-center justify-center hover:border-pul hover:text-pul
                hover:bg-pud transition-all duration-150">
              i
            </button>
          )}
        </div>
        <div className="font-mono text-sm font-medium text-white">
          {value}
          {unit && <span className="text-[0.6rem] text-t3 ml-1">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--pct': pct } as React.CSSProperties}
        onChange={handleChange}
      />
    </div>
  )
}
