import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'InsomnAI',
  description: 'AI-powered insomnia risk assessment',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0a0a12',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <body className="bg-bg text-t1 font-sans min-h-screen antialiased">
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_45%_at_50%_-5%,rgba(124,92,252,0.18)_0%,transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_95%_50%,rgba(90,70,180,0.07)_0%,transparent_60%)]" />
        </div>
        <Header />
        {children}
      </body>
    </html>
  )
}