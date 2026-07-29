import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EXHIBITS } from '../data/caseData'
import { ASSETS } from '../data/assets'
import { AssetImage } from './AssetImage'
import { SectionHeader } from './Suspects'

gsap.registerPlugin(ScrollTrigger)

const EVIDENCE_IMAGES: Record<string, string> = {
  glowBall: ASSETS.evidence.glowBall,
  nightVision: ASSETS.evidence.nightVision,
  flashlight: ASSETS.evidence.flashlight,
  tireTracks: ASSETS.evidence.tireTracks,
  scorecard: ASSETS.evidence.scorecard,
}

interface EvidenceLockerProps {
  onGlowBallClick?: () => void
  glowIntensity?: number
}

export function EvidenceLocker({ onGlowBallClick, glowIntensity = 1 }: EvidenceLockerProps) {
  const [openFolder, setOpenFolder] = useState<string | null>(null)
  const cabinetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cabinetRef.current) {
      gsap.from('.evidence-folder', {
        scrollTrigger: { trigger: cabinetRef.current, start: 'top 75%' },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
      })
    }
  }, [])

  return (
    <section id="evidence" className="section-padding">
      <div className="container-max">
        <SectionHeader
          tag="EVIDENCE LOCKER"
          title="Exhibits A–E"
          subtitle="Handle with gloves. Some items may still be glowing."
        />

        <div ref={cabinetRef} className="evidence-cabinet mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {EXHIBITS.map((exhibit) => (
            <motion.button
              key={exhibit.id}
              className="evidence-folder group"
              onClick={() => setOpenFolder(exhibit.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="folder-tab">EXHIBIT {exhibit.id}</div>
              <div className="folder-body">
                <span className="folder-label">{exhibit.title}</span>
                <div className="folder-glow" />
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {openFolder && (
            <motion.div
              className="fixed inset-0 z-[5000] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenFolder(null)}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div
                className="evidence-modal relative z-10 max-w-lg w-full"
                initial={{ scale: 0.8, rotateX: 20, opacity: 0 }}
                animate={{ scale: 1, rotateX: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const exhibit = EXHIBITS.find((e) => e.id === openFolder)!
                  const imgSrc = EVIDENCE_IMAGES[exhibit.assetKey]
                  const isGlowBall = exhibit.assetKey === 'glowBall'
                  return (
                    <>
                      <div className="stamp-animate absolute -top-3 -right-3 bg-red-700 text-white font-mono text-xs px-3 py-1 rotate-12 z-20">
                        EVIDENCE
                      </div>
                      <div className="bg-paper text-midnight p-6">
                        <p className="font-mono text-xs text-midnight/50 tracking-widest">EXHIBIT {exhibit.id}</p>
                        <h3 className="font-display text-2xl mt-1">{exhibit.title}</h3>
                        <div
                          className="my-4 h-48 bg-midnight/5 flex items-center justify-center overflow-hidden relative cursor-pointer"
                          onClick={isGlowBall ? onGlowBallClick : undefined}
                          style={isGlowBall ? {
                            boxShadow: `0 0 ${30 * glowIntensity}px ${15 * glowIntensity}px rgba(57, 255, 20, ${Math.min(0.6, 0.1 * glowIntensity)})`,
                          } : undefined}
                        >
                          <AssetImage
                            src={imgSrc}
                            alt={exhibit.title}
                            className={`max-h-full max-w-full object-contain ${isGlowBall ? 'glow-ball-pulse' : ''}`}
                            fallbackClassName="h-full w-full"
                            label={exhibit.title}
                          />
                        </div>
                        <p className="font-mono text-sm text-midnight/70">{exhibit.description}</p>
                        <button
                          onClick={() => setOpenFolder(null)}
                          className="mt-4 w-full py-2 border border-midnight/20 font-mono text-xs tracking-widest hover:bg-midnight/5 transition-colors"
                        >
                          CLOSE FILE
                        </button>
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
