import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-24 pb-32 text-center">
      <div className="inline-flex items-center gap-2 font-mono text-[0.7rem] text-t3
        border border-white/[0.07] rounded-full px-4 py-1.5 mb-8 bg-white/[0.02]">
        <span className="w-1.5 h-1.5 rounded-full bg-pul" />
        ML · EEG · ECG · LLM Summary
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
        Understand your{' '}
        <span className="bg-gradient-to-r from-pul via-purple-400 to-purple-300
          bg-clip-text text-transparent">
          sleep risk
        </span>
      </h1>

      <p className="text-t2 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
        A clinical-grade insomnia assessment using bio-signals, lifestyle data,
        and machine learning. Get a personalised AI report in under 3 minutes.
      </p>

      <Link href="/assess/step/1"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-pu to-[#4f36cc]
          text-white font-bold text-lg px-10 py-4 rounded-2xl
          shadow-[0_4px_28px_rgba(124,92,252,0.45)]
          hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0
          transition-all duration-150">
        Begin Assessment
        <span className="text-pul/70">→</span>
      </Link>

      <p className="mt-5 text-t3 font-mono text-xs">
        Not a medical diagnosis · Research / demo use only
      </p>

      {/* Feature pills */}
      <div className="mt-20 flex flex-wrap justify-center gap-3">
        {[
          '6-step assessment',
          'EEG / ECG inputs',
          'SHAP factor breakdown',
          'ISI questionnaire',
          'LLM clinical summary',
          'Sleep architecture chart',
        ].map((f) => (
          <span key={f}
            className="font-mono text-[0.7rem] text-t3 border border-white/[0.07]
              rounded-full px-3.5 py-1.5 bg-white/[0.02]">
            {f}
          </span>
        ))}
      </div>
    </main>
  )
}
