import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { CHARGES } from '../data/caseData'
import { ASSETS } from '../data/assets'
import { AssetImage } from './AssetImage'
import { SectionHeader } from './Suspects'

interface CourtroomProps {
  onJudgeClick?: () => void
  judgeClicks?: number
  contempt?: boolean
}

export function Courtroom({ onJudgeClick, judgeClicks = 0, contempt = false }: CourtroomProps) {
  const [phase, setPhase] = useState<'entering' | 'charges' | 'verdict' | 'done'>('entering')
  const [guiltyCount, setGuiltyCount] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const gavelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('charges'), 2000)
    const t2 = setTimeout(() => setPhase('verdict'), 2000 + CHARGES.length * 800 + 1000)
    const t3 = setTimeout(() => setPhase('done'), 2000 + CHARGES.length * 800 + 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (phase === 'verdict') {
      CHARGES.forEach((_, i) => {
        setTimeout(() => setGuiltyCount(i + 1), i * 800)
      })
    }
    if (phase === 'done' && gavelRef.current) {
      gsap.to(gavelRef.current, {
        rotation: -30,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(sectionRef.current, { x: '+=5', duration: 0.05, yoyo: true, repeat: 5 })
        },
      })
    }
  }, [phase])

  return (
    <section id="courtroom" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AssetImage
          src={ASSETS.courtroom.background}
          alt="Courtroom"
          className="w-full h-full object-cover opacity-20"
          fallbackClassName="w-full h-full courtroom-fallback"
          label="Courtroom Background"
        />
      </div>

      <div className="container-max relative z-10">
        <SectionHeader
          tag="SUPERIOR COURT"
          title="The People vs. The Defendants"
          subtitle="All rise. Court is now in session."
        />

        <div className="courtroom-stage mt-12 max-w-3xl mx-auto">
          {/* Judge */}
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={phase !== 'entering' ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center mb-8"
          >
            <button
              onClick={onJudgeClick}
              className="relative group cursor-pointer"
              aria-label="Judge"
            >
              <AssetImage
                src={ASSETS.courtroom.judge}
                alt="The Judge"
                className="h-40 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform"
                fallbackClassName="h-40 w-32"
                label="Judge"
              />
              {judgeClicks > 0 && judgeClicks < 10 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-mono w-6 h-6 rounded-full flex items-center justify-center">
                  {judgeClicks}
                </span>
              )}
            </button>
            <p className="font-display text-brass mt-2 tracking-widest">THE HONORABLE JUDGE</p>
          </motion.div>

          {contempt && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center mb-6 border-4 border-red-600 text-red-500 font-display text-2xl py-3 rotate-[-2deg] animate-pulse"
            >
              HELD IN CONTEMPT OF COURT
            </motion.div>
          )}

          {/* Jury */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="w-8 h-8 rounded-full bg-paper/10 border border-paper/20 flex items-center justify-center text-xs"
              >
                👤
              </motion.div>
            ))}
          </div>

          {/* Charges reading */}
          {(phase === 'charges' || phase === 'verdict' || phase === 'done') && (
            <div className="bg-charcoal/80 border border-brass/20 p-6 space-y-3">
              <p className="font-mono text-xs text-brass tracking-widest text-center mb-4">
                READING OF CHARGES
              </p>
              {CHARGES.map((charge, i) => (
                <motion.div
                  key={charge}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="font-mono text-sm text-paper/70">{charge}</span>
                  {phase !== 'charges' && i < guiltyCount && (
                    <motion.span
                      initial={{ scale: 3, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: -8 }}
                      className="guilty-stamp-sm shrink-0"
                    >
                      GUILTY
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Gavel */}
          {phase === 'done' && (
            <div ref={gavelRef} className="text-center mt-8 origin-bottom">
              <span className="text-5xl">🔨</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
