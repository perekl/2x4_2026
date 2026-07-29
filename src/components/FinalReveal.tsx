import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CASE } from '../data/caseData'
import { ASSETS } from '../data/assets'
import { useCountdown } from '../hooks/useCountdown'
import { AssetImage } from './AssetImage'

gsap.registerPlugin(ScrollTrigger)

export function FinalReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const countdown = useCountdown(CASE.teeTime)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-content > *', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="reveal" ref={sectionRef} className="section-padding min-h-screen flex items-center">
      <div className="container-max reveal-content text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          className="mb-8"
        >
          <p className="font-mono text-xs text-brass tracking-[0.5em] mb-4">FINAL SENTENCING</p>
          <h2 className="font-display text-3xl md:text-5xl text-paper mb-2">
            The Defendants are hereby sentenced to...
          </h2>
          <motion.p
            className="font-display text-5xl md:text-7xl text-neon glow-text mt-4"
            animate={{ textShadow: ['0 0 20px #39ff14', '0 0 40px #39ff14', '0 0 20px #39ff14'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            18 Holes of Golf
          </motion.p>
          <p className="font-mono text-sm text-paper/50 mt-4">
            Effective: Tomorrow Morning
          </p>
        </motion.div>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-brass to-transparent" />

        <motion.div
          className="defendant-reveal"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
        >
          <p className="font-mono text-xs text-paper/40 tracking-[0.4em] mb-6">CASE RESOLVED — MEET THE TEAM</p>

          <div className="flex justify-center items-end gap-4 md:gap-8 mb-8">
            <AssetImage
              src={ASSETS.suspects.bob.full}
              alt="Suspect #1"
              className="h-48 md:h-64 object-contain drop-shadow-2xl"
              fallbackClassName="h-48 w-32"
              label="Suspect #1"
            />
            <span className="font-display text-4xl text-brass">&</span>
            <AssetImage
              src={ASSETS.suspects.perek.full}
              alt="Suspect #2"
              className="h-48 md:h-64 object-contain drop-shadow-2xl"
              fallbackClassName="h-48 w-32"
              label="Suspect #2"
            />
          </div>

          <h3 className="font-display text-2xl md:text-3xl text-brass tracking-wider mb-2">
            BOB & PEREK
          </h3>
          <p className="font-mono text-sm text-paper/60 mb-1">Team Name:</p>
          <p className="font-display text-xl md:text-2xl text-neon border border-neon/30 inline-block px-6 py-2 mb-4">
            {CASE.teamNamePlaceholder}
          </p>
          <p className="font-mono text-xs text-paper/50 tracking-widest">
            COMPETING IN TOMORROW'S TWOSOME TOURNAMENT
          </p>
        </motion.div>

        <div className="countdown mt-12 inline-block">
          <p className="font-mono text-xs text-paper/40 tracking-[0.3em] mb-4">TEE TIME COUNTDOWN</p>
          <div className="flex gap-4 justify-center">
            {[
              { label: 'HRS', value: countdown.hours + countdown.days * 24 },
              { label: 'MIN', value: countdown.minutes },
              { label: 'SEC', value: countdown.seconds },
            ].map((unit) => (
              <div key={unit.label} className="countdown-unit">
                <span className="countdown-value">{String(unit.value).padStart(2, '0')}</span>
                <span className="countdown-label">{unit.label}</span>
              </div>
            ))}
          </div>
          {countdown.expired && (
            <p className="text-neon font-mono text-sm mt-4 animate-pulse">IT'S TEE TIME. FORE!</p>
          )}
        </div>
      </div>
    </section>
  )
}
