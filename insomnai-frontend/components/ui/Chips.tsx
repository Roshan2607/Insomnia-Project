'use client'

interface ChipsProps {
  name: string
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}

export default function Chips({ name, label, options, value, onChange }: ChipsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.7rem] font-medium text-t2 uppercase tracking-wider">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium border transition-all duration-150
              ${value === o.value
                ? 'bg-pud border-pu text-pul'
                : 'border-white/[0.09] text-t3 bg-white/[0.025] hover:border-pu/40 hover:text-t1'
              }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
