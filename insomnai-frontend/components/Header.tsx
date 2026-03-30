'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { checkHealth } from '@/lib/api'

export default function Header() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'offline'>('checking')

  useEffect(() => {
    checkHealth()
      .then((d) => setStatus(d.model_loaded ? 'ready' : 'offline'))
      .catch(() => setStatus('offline'))
  }, [])

  const dot = status === 'ready'
    ? 'bg-lo shadow-[0_0_8px_#34d399]'
    : status === 'offline'
    ? 'bg-hi'
    : 'bg-t3 animate-pulse'

  const label = status === 'ready' ? 'model ready' : status === 'offline' ? 'api offline' : 'connecting…'

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4
      bg-bg/80 backdrop-blur-xl border-b border-white/5">
      <Link href="/" className="font-extrabold text-xl tracking-tight
        bg-gradient-to-r from-white to-pul bg-clip-text text-transparent">
        InsomnAI
      </Link>
      <div className="flex items-center gap-2 font-mono text-[0.68rem] text-t3
        bg-white/[0.03] border border-white/[0.06] rounded-full px-3.5 py-1.5">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500 ${dot}`} />
        {label}
      </div>
    </header>
  )
}
