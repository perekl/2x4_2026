import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CHARGES } from '../data/caseData'
import { SectionHeader } from './Suspects'

gsap.registerPlugin(ScrollTrigger)

export function Charges() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.charge-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        x: -40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
      })
      gsap.from('.guilty-stamp', {
        scrollTrigger: { trigger: '.charges-list', start: 'top 60%' },
        scale: 2,
        opacity: 0,
        rotation: -15,
        duration: 0.5,
        delay: CHARGES.length * 0.15 + 0.3,
        ease: 'back.out(3)',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="charges" ref={sectionRef} className="section-padding">
      <div className="container-max">
        <SectionHeader
          tag="CRIMINAL INDICTMENT"
          title="Formal Charges"
          subtitle="The Defendants stand accused of the following violations."
        />

        <div className="charges-list max-w-2xl mx-auto mt-12 relative">
          <div className="bg-paper text-midnight p-8 md:p-10 shadow-2xl relative">
            <div className="border-2 border-midnight/20 p-6 space-y-4">
              <div className="text-center border-b border-midnight/10 pb-4 mb-4">
                <p className="font-mono text-xs tracking-[0.3em] text-midnight/50">STATE vs. THE DEFENDANTS</p>
                <p className="font-display text-lg mt-1">Case No. 2026-MT-071</p>
              </div>

              {CHARGES.map((charge, i) => (
                <div key={charge} className="charge-item flex items-start gap-4">
                  <span className="font-mono text-burgundy font-bold text-sm min-w-[24px]">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <div className="flex-1 border-b border-dashed border-midnight/15 pb-3">
                    <p className="font-display text-midnight text-lg">{charge}</p>
                    <p className="font-mono text-xs text-midnight/40 mt-1">PENAL CODE § 18.{i + 1}-GOLF</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="guilty-stamp absolute -bottom-4 -right-4 rotate-[-12deg] border-4 border-red-700 text-red-700 font-display text-2xl px-6 py-2 opacity-90">
              INDICTED
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
