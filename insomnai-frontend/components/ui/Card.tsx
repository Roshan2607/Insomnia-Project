export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-white/[0.055] to-white/[0.018]
      border border-white/[0.08] rounded-2xl p-6
      shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_4px_20px_rgba(0,0,0,0.28)]
      mb-4 ${className}`}>
      {children}
    </div>
  )
}
