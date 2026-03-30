'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessmentStore'
import type { PredictResponse } from '@/lib/types'

function riskColor(pct: number) {
  if (pct >= 70) return '#f87171'
  if (pct >= 40) return '#fbbf24'
  return '#34d399'
}

function ScoreCard({ result }: { result: PredictResponse }) {
  const pct   = Math.round(result.insomnia_risk * 100)
  const color = riskColor(pct)
  const max   = Math.max(...result.top_factors.map((f) => Math.abs(f.impact)), 0.001)

  return (
    <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02]
      border border-white/[0.08] rounded-2xl p-6 mb-4
      shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_4px_20px_rgba(0,0,0,0.3)]">

      {/* Score row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-6xl font-extrabold tracking-tight leading-none mb-1"
            style={{ color }}>{pct}%</div>
          <div className="text-sm font-semibold" style={{ color }}>{result.prediction}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-t3 mb-2">{pct} / 100</div>
          <div className="w-36 h-2 bg-s3 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="text-[0.7rem] font-mono text-t3 uppercase tracking-wider mb-3">
        Top contributing factors
      </div>
      <div className="flex flex-col gap-2">
        {result.top_factors.map((f) => {
          const bar = (Math.abs(f.impact) / max * 100).toFixed(1)
          const pos = f.impact > 0
          return (
            <div key={f.feature} className="flex items-center gap-3">
              <div className="w-32 text-[0.75rem] text-t2 truncate flex-shrink-0">
                {f.feature.replace(/_/g, ' ')}
              </div>
              <div className="flex-1 h-1.5 bg-s3 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${bar}%`,
                    background: pos ? '#f87171' : '#34d399',
                  }} />
              </div>
              <div className={`font-mono text-[0.72rem] w-14 text-right flex-shrink-0
                ${pos ? 'text-hi' : 'text-lo'}`}>
                {f.impact > 0 ? '+' : ''}{f.impact.toFixed(3)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NLPSummary({ report }: { report: string | null }) {
  const icons  = ['🔍', '⚡', '💡']
  const labels = ['Pattern detected', 'Likely cause', 'Recommendation']

  const points = report
    ? report.trim()
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10)
        .slice(0, 3)
    : []

  return (
    <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02]
      border border-white/[0.08] rounded-2xl p-6 mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-pud flex items-center justify-center text-lg">🧠</div>
        <div>
          <div className="font-semibold text-sm text-t1">AI Clinical Summary</div>
          <div className="font-mono text-[0.65rem] text-t3">llama3 via Groq</div>
        </div>
      </div>

      {points.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {points.map((s, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-pud/40 border border-pul/10 rounded-xl
              animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0
                bg-pul/10 mt-0.5">{icons[i]}</div>
              <div className="flex-1">
                <div className="text-[0.62rem] font-mono font-semibold text-pul uppercase tracking-widest mb-1">
                  {labels[i]}
                </div>
                <div className="text-[0.83rem] text-t1 leading-relaxed">{s}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="font-mono text-[0.8rem] text-t3 py-2">
          Report unavailable — ensure your LLM backend is running.
        </div>
      )}
    </div>
  )
}

function SleepChart({ inputs, riskPct }: { inputs: ReturnType<typeof useAssessmentStore>['data']; riskPct: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = 140
    const dpr = window.devicePixelRatio || 1
    canvas.width  = W * dpr
    canvas.height = H * dpr
    canvas.style.width  = W + 'px'
    canvas.style.height = H + 'px'
    ctx.scale(dpr, dpr)

    const risk  = riskPct / 100
    const beta  = inputs.eeg_beta  || 15
    const theta = inputs.eeg_theta || 5
    const segs  = 40
    const segW  = W / segs

    const COLORS = ['#7c5cfc', '#a78bfa', '#34d399', '#fbbf24']
    const stages: number[] = []

    for (let i = 0; i < segs; i++) {
      const t = i / segs
      let stage: number
      if (t < 0.1) {
        stage = risk > 0.6 ? 0 : 1
      } else if (t < 0.45) {
        const deepChance = Math.max(0, 1 - risk - (beta - 10) / 30)
        stage = Math.random() < deepChance ? 2 : 1
      } else if (t < 0.75) {
        const remChance = Math.max(0, 0.6 - risk * 0.5 - (theta < 4 ? 0.2 : 0))
        stage = Math.random() < remChance ? 3 : Math.random() < 0.4 ? 0 : 1
      } else {
        stage = risk > 0.7 ? 0 : Math.random() < 0.3 ? 3 : 1
      }
      stages.push(stage)
    }

    const stageH = H / 4
    stages.forEach((stage, i) => {
      const x = i * segW
      const y = stage * stageH
      ctx.fillStyle = COLORS[stage] + '33'
      ctx.fillRect(x, y, segW + 1, stageH)
      ctx.fillStyle = COLORS[stage]
      ctx.fillRect(x, y + stageH - 2, segW + 1, 2)
    })

    // Y-axis labels
    const labels = ['Awake', 'Light', 'Deep', 'REM']
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.fillStyle = 'rgba(144,144,168,0.6)'
    labels.forEach((lbl, i) => {
      ctx.fillText(lbl, 4, i * stageH + stageH / 2 + 4)
    })
  }, [inputs, riskPct])

  return (
    <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02]
      border border-white/[0.08] rounded-2xl p-6 mb-4">
      <div className="font-mono text-[0.7rem] text-t3 uppercase tracking-wider mb-4">
        Estimated Sleep Architecture
      </div>
      <canvas ref={canvasRef} className="w-full" />
      <div className="flex gap-4 mt-3 flex-wrap">
        {[
          { color: '#7c5cfc', label: 'Awake' },
          { color: '#a78bfa', label: 'Light Sleep' },
          { color: '#34d399', label: 'Deep Sleep' },
          { color: '#fbbf24', label: 'REM' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            <span className="font-mono text-[0.68rem] text-t3">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ISIBox({ total, severity }: { total: number; severity: string }) {
  return (
    <div className="flex items-center justify-between
      bg-gradient-to-br from-white/[0.06] to-white/[0.02]
      border border-white/[0.08] rounded-2xl px-6 py-4 mb-4">
      <div>
        <div className="font-mono text-[0.65rem] text-t3 uppercase tracking-wider mb-1">ISI Score</div>
        <div className="text-2xl font-extrabold text-t1">{total} <span className="text-t3 text-base font-normal">/ 28</span></div>
      </div>
      <div className="text-right">
        <div className="font-mono text-[0.65rem] text-t3 uppercase tracking-wider mb-1">Severity</div>
        <div className="text-lg font-bold text-pul">{severity}</div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const { result, data, reset } = useAssessmentStore()

  useEffect(() => {
    if (!result) router.replace('/assess/step/1')
  }, [result, router])

  if (!result) return null

  const pct = Math.round(result.insomnia_risk * 100)

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 pb-24 animate-fade-up">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
          Your sleep{' '}
          <em className="not-italic bg-gradient-to-r from-pul to-purple-300 bg-clip-text text-transparent">
            assessment
          </em>
        </h2>
        <p className="font-mono text-[0.75rem] text-t3">
          // powered by Random Forest + llama3 · not a medical diagnosis
        </p>
      </div>

      <ScoreCard result={result} />
      <NLPSummary report={result.nlp_report} />
      <SleepChart inputs={data} riskPct={pct} />
      {result.isi_total != null && (
        <ISIBox total={result.isi_total} severity={result.isi_severity ?? ''} />
      )}

      <button
        onClick={() => { reset(); router.push('/assess/step/1') }}
        className="w-full mt-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08]
          text-t2 font-medium hover:bg-white/[0.08] hover:text-t1 transition-all">
        ↺ Start over
      </button>
    </main>
  )
}
