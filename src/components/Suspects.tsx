import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SUSPECTS } from '../data/caseData'
import { ASSETS } from '../data/assets'
import { AssetImage } from './AssetImage'

gsap.registerPlugin(ScrollTrigger)

const SUSPECT_ASSETS = [
  { full: ASSETS.suspects.bob.full, mugshot: ASSETS.suspects.bob.mugshot },
  { full: ASSETS.suspects.perek.full, mugshot: ASSETS.suspects.perek.mugshot },
]

export function Suspects() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.suspect-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        y: 60,
        opacity: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="suspects" ref={sectionRef} className="section-padding">
      <div className="container-max">
        <SectionHeader
          tag="PERSONNEL FILES"
          title="Known Suspects"
          subtitle="Two individuals of interest. Treat as armed with golf clubs."
        />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {SUSPECTS.map((suspect, i) => (
            <motion.div
              key={suspect.id}
              className="suspect-card dossier-card relative overflow-hidden"
              whileHover={{ y: -4 }}
            >
              <div className="absolute top-4 left-4 z-10">
                <span className="badge-red">{suspect.label}</span>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="suspect-image-area relative h-64 md:h-80 md:w-1/2 bg-midnight/50 flex items-end justify-center">
                  <AssetImage
                    src={SUSPECT_ASSETS[i].full}
                    alt={`${suspect.label} full body`}
                    className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                    fallbackClassName="h-full w-full"
                    label={`${suspect.label} — drop PNG here`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-charcoal to-transparent" />
                </div>

                <div className="p-6 md:w-1/2 space-y-3">
                  <h3 className="font-display text-2xl text-brass tracking-wider">{suspect.name}</h3>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <Field label="Occupation" value={suspect.occupation} />
                    <Field label="Known Aliases" value={suspect.aliases.join(', ')} />
                    <Field label="Last Seen" value={suspect.lastSeen} />
                    <Field label="Threat Level" value={suspect.threatLevel} highlight="green" />
                    <Field label="Golf IQ" value={suspect.golfIQ} highlight="red" />
                  </div>

                  <p className="text-paper/50 text-xs font-mono leading-relaxed border-t border-paper/10 pt-3 mt-3">
                    {suspect.notes}
                  </p>

                  <div className="mt-4 w-20 h-24 border-2 border-paper/20 overflow-hidden">
                    <AssetImage
                      src={SUSPECT_ASSETS[i].mugshot}
                      alt={`${suspect.label} mugshot`}
                      className="w-full h-full object-cover grayscale"
                      fallbackClassName="w-full h-full"
                      label="Mugshot"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: 'green' | 'red' }) {
  const color = highlight === 'green' ? 'text-neon' : highlight === 'red' ? 'text-red-400' : 'text-paper/80'
  return (
    <div className="flex gap-2">
      <span className="text-paper/40 font-mono text-xs uppercase tracking-wider min-w-[100px]">{label}:</span>
      <span className={`font-mono text-xs ${color}`}>{value}</span>
    </div>
  )
}

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <span className="section-tag">{tag}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
    </div>
  )
}

export { SectionHeader }
