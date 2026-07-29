import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { WITNESSES } from '../data/caseData'
import { ASSETS } from '../data/assets'
import { SectionHeader } from './Suspects'

interface WitnessStatementsProps {
  onGooseClick?: () => void
  gooseAnger?: number
}

export function WitnessStatements({ onGooseClick, gooseAnger = 0 }: WitnessStatementsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.witness-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        rotateY: 90,
        opacity: 0,
        stagger: 0.2,
        duration: 0.7,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="witnesses" ref={sectionRef} className="section-padding">
      <div className="container-max">
        <SectionHeader
          tag="WITNESS TESTIMONY"
          title="Statements on Record"
          subtitle="Sworn depositions from individuals near the scene."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {WITNESSES.map((witness) => (
            <motion.div
              key={witness.id}
              className="witness-card dossier-card p-6 relative"
              whileHover={{ scale: 1.02 }}
            >
              <span className={`absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 ${
                witness.badge === 'HOSTILE' ? 'bg-red-900/50 text-red-300' : 'bg-brass/20 text-brass'
              }`}>
                {witness.badge}
              </span>

              {witness.id === 'goose' && (
                <button
                  onClick={onGooseClick}
                  className="absolute top-4 left-4 w-12 h-12 rounded-full overflow-hidden border border-paper/20 hover:border-neon transition-colors"
                  aria-label="Angry goose"
                >
                  <img src={ASSETS.misc.goose} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <span className="absolute inset-0 flex items-center justify-center text-lg">🪿</span>
                </button>
              )}

              <div className="mt-8">
                <p className="font-mono text-xs text-paper/40 tracking-widest">{witness.role}</p>
                <h3 className="font-display text-xl text-brass mt-1">{witness.name}</h3>
              </div>

              <blockquote className="mt-4 border-l-2 border-brass/40 pl-4">
                <p className={`font-mono text-sm text-paper/80 leading-relaxed ${
                  witness.id === 'goose' ? 'text-2xl font-bold' : ''
                }`} style={witness.id === 'goose' ? { fontSize: `${1.2 + gooseAnger * 0.3}rem` } : undefined}>
                  "{witness.quote}"
                </p>
                {'translation' in witness && (
                  <p className="mt-2 font-mono text-xs text-neon">
                    Translation: "{witness.translation}"
                  </p>
                )}
              </blockquote>

              {witness.id === 'goose' && gooseAnger > 0 && (
                <p className="mt-2 text-red-400 font-mono text-xs animate-pulse">
                  {'HONK '.repeat(gooseAnger)}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
