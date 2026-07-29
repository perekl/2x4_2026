import { useState, useCallback, useEffect } from 'react'
import { IntroSequence } from './components/IntroSequence'
import { HomePage } from './components/HomePage'
import { Suspects } from './components/Suspects'
import { Charges } from './components/Charges'
import { EvidenceLocker } from './components/EvidenceLocker'
import { WitnessStatements } from './components/WitnessStatements'
import { CrimeScene } from './components/CrimeScene'
import { MiniGame } from './components/MiniGame'
import { Courtroom } from './components/Courtroom'
import { FinalReveal } from './components/FinalReveal'
import { AppealsCourt } from './components/AppealsCourt'
import { GolfBallRain } from './components/GolfBallRain'
import { FilmGrain, SirenReflection } from './components/effects/VisualEffects'
import { useEasterEggs } from './hooks/useEasterEggs'

function App() {
  const [introDone, setIntroDone] = useState(false)
  const [skipIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('skipIntro')
    }
    return false
  })

  const {
    appealsUnlocked,
    glowIntensity,
    golfBallRain,
    contempt,
    gooseAnger,
    judgeClicks,
    clickGlowBall,
    clickJudge,
    clickGoose,
  } = useEasterEggs()

  const handleIntroComplete = useCallback(() => setIntroDone(true), [])

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section)
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (skipIntro) setIntroDone(true)
  }, [skipIntro])

  return (
    <div className="app-root relative bg-midnight text-paper min-h-screen overflow-x-hidden">
      <FilmGrain />
      <SirenReflection />

      {!introDone && !skipIntro && <IntroSequence onComplete={handleIntroComplete} />}

      {appealsUnlocked && <AppealsCourt />}
      {golfBallRain && <GolfBallRain />}

      <nav className="fixed top-0 left-0 right-0 z-[100] nav-bar">
        <div className="container-max flex items-center justify-between py-3 px-4">
          <button onClick={() => handleNavigate('home')} className="font-mono text-xs text-brass tracking-widest hover:text-neon transition-colors">
            ◆ OPERATION: MOONLIGHT TEE
          </button>
          <div className="hidden md:flex gap-4">
            {['suspects', 'evidence', 'crime-scene', 'mini-game', 'courtroom', 'reveal'].map((s) => (
              <button
                key={s}
                onClick={() => handleNavigate(s)}
                className="font-mono text-[10px] text-paper/40 hover:text-brass uppercase tracking-wider transition-colors"
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <HomePage onNavigate={handleNavigate} />
        <Suspects />
        <Charges />
        <EvidenceLocker onGlowBallClick={clickGlowBall} glowIntensity={glowIntensity} />
        <WitnessStatements onGooseClick={clickGoose} gooseAnger={gooseAnger} />
        <CrimeScene />
        <MiniGame />
        <Courtroom
          onJudgeClick={clickJudge}
          judgeClicks={judgeClicks}
          contempt={contempt}
        />
        <FinalReveal />
      </main>

      <footer className="py-8 text-center border-t border-paper/5">
        <p className="font-mono text-[10px] text-paper/20 tracking-[0.3em]">
          CASE FILE 2026-MT-071 — THE DEFENDANTS — ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  )
}

export default App
