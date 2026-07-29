import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

interface IntroSequenceProps {
  onComplete: () => void
}

const RADIO_LINES = [
  { speaker: 'DISPATCH', text: 'All units... reports of glowing projectiles crossing Fairway 14.', delay: 800 },
  { speaker: 'UNIT 7', text: 'Copy dispatch. Possible trespassers. Possible UFO activity.', delay: 3200 },
  { speaker: 'DISPATCH', text: 'Proceed with caution. I repeat — glowing projectiles.', delay: 5800 },
]

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<'radio' | 'fade' | 'done'>('radio')
  const [visibleLines, setVisibleLines] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers = RADIO_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), RADIO_LINES[i].delay)
    )
    const fadeTimer = setTimeout(() => setPhase('fade'), 8500)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 10000)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  useEffect(() => {
    if (phase === 'fade' && containerRef.current) {
      gsap.to(containerRef.current, { opacity: 0, duration: 1.5, ease: 'power2.inOut' })
    }
  }, [phase])

  if (phase === 'done') return null

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="intro-sequence fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="radio-static absolute inset-0 opacity-20" />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500/80 font-mono text-xs tracking-widest">LIVE FEED</span>
        </div>

        <div className="max-w-lg px-8 space-y-6">
          {RADIO_LINES.slice(0, visibleLines).map((line) => (
            <motion.div
              key={line.speaker}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="radio-line"
            >
              <span className="text-brass font-mono text-xs tracking-widest block mb-1">
                [{line.speaker}]
              </span>
              <p className="text-paper/90 font-mono text-sm leading-relaxed typewriter-cursor">
                {line.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-8 text-paper/30 font-mono text-xs tracking-[0.3em] animate-pulse">
          CLASSIFIED TRANSMISSION
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
