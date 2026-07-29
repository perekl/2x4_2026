import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CRIME_MARKERS } from '../data/caseData'
import { ASSETS } from '../data/assets'
import { AssetImage } from './AssetImage'
import { SectionHeader } from './Suspects'

export function CrimeScene() {
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <section id="crime-scene" className="section-padding">
      <div className="container-max">
        <SectionHeader
          tag="CRIME SCENE ANALYSIS"
          title="Aerial Surveillance Map"
          subtitle="Move flashlight to investigate. Click markers for intel."
        />

        <div
          ref={mapRef}
          className="crime-map relative mt-12 aspect-[16/10] rounded-lg overflow-hidden cursor-none"
          onMouseMove={handleMouseMove}
        >
          <AssetImage
            src={ASSETS.crimeScene.aerial}
            alt="Aerial map of golf course"
            className="w-full h-full object-cover opacity-40"
            fallbackClassName="w-full h-full crime-map-fallback"
            label="Aerial Map"
          />

          <div className="crime-map-overlay absolute inset-0 bg-midnight/60" />

          {/* Flashlight */}
          <div
            className="flashlight-beam pointer-events-none"
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
          />

          {/* Evidence strings board effect */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            {CRIME_MARKERS.map((m, i) => {
              const next = CRIME_MARKERS[(i + 1) % CRIME_MARKERS.length]
              return (
                <line
                  key={`line-${m.id}`}
                  x1={`${m.x}%`}
                  y1={`${m.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke="#c9a227"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              )
            })}
          </svg>

          {CRIME_MARKERS.map((marker) => (
            <button
              key={marker.id}
              className="evidence-marker absolute z-10"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onClick={() => setActiveMarker(marker.id)}
              aria-label={marker.label}
            >
              <span className="marker-pin" />
              <span className="marker-number">{marker.id}</span>
            </button>
          ))}

          <AnimatePresence>
            {activeMarker !== null && (
              <motion.div
                className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
              >
                {(() => {
                  const m = CRIME_MARKERS.find((mk) => mk.id === activeMarker)!
                  return (
                    <div className="dossier-card p-4">
                      <p className="font-mono text-xs text-brass tracking-widest">MARKER #{m.id}</p>
                      <h4 className="font-display text-lg text-paper mt-1">{m.label}</h4>
                      <p className="font-mono text-xs text-paper/60 mt-2">{m.detail}</p>
                      <button
                        onClick={() => setActiveMarker(null)}
                        className="mt-3 text-xs font-mono text-paper/40 hover:text-brass"
                      >
                        DISMISS ×
                      </button>
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
