import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { CASE } from '../data/caseData'
import { ASSETS } from '../data/assets'

interface HomePageProps {
  onNavigate: (section: string) => void
}

const NAV_BUTTONS = [
  { label: 'Enter Evidence Locker', section: 'evidence', icon: '🔒' },
  { label: 'Review Case File', section: 'charges', icon: '📋' },
  { label: 'Meet the Suspects', section: 'suspects', icon: '👤' },
]

export function HomePage({ onNavigate }: HomePageProps) {
  const stampRef = useRef<HTMLDivElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (stampRef.current) {
      gsap.fromTo(
        stampRef.current,
        { scale: 3, opacity: 0, rotation: -25 },
        { scale: 1, opacity: 1, rotation: -12, duration: 0.6, ease: 'back.out(2)', delay: 0.8 }
      )
    }
    if (sealRef.current) {
      gsap.from(sealRef.current, { scale: 0, rotation: -180, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: 0.3 })
    }
  }, [])

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center px-4 py-20">
      <div className="case-file max-w-2xl w-full relative">
        <div className="case-file-inner bg-paper text-midnight p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brass via-burgundy to-brass" />

          <div ref={sealRef} className="flex justify-center mb-8">
            <img
              src={ASSETS.misc.seal}
              alt="Government Seal"
              className="w-32 h-32 md:w-40 md:h-40 drop-shadow-lg"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="font-mono text-xs text-midnight/50 tracking-[0.4em] mb-2">CLASSIFIED CASE FILE</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-midnight tracking-tight mb-2">
              {CASE.title}
            </h1>
            <p className="font-mono text-sm text-midnight/60 mb-1">Case Number: {CASE.number}</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-midnight/5 border border-midnight/10">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-red-800 font-bold">
                STATUS: {CASE.status}
              </span>
            </div>
          </motion.div>

          <div
            ref={stampRef}
            className="confidential-stamp absolute top-8 right-4 md:right-8 opacity-0"
          >
            CONFIDENTIAL
          </div>

          <div className="mt-10 space-y-3">
            {NAV_BUTTONS.map((btn, i) => (
              <motion.button
                key={btn.section}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                onClick={() => onNavigate(btn.section)}
                className="nav-btn w-full group"
              >
                <span className="text-lg">{btn.icon}</span>
                <span>{btn.label}</span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-midnight/10 flex flex-wrap gap-2 justify-center">
            {['evidence', 'witnesses', 'crime-scene', 'mini-game', 'courtroom'].map((s) => (
              <button
                key={s}
                onClick={() => onNavigate(s)}
                className="text-xs font-mono text-midnight/40 hover:text-burgundy transition-colors uppercase tracking-wider"
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
