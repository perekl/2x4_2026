import { useCallback, useEffect, useState } from 'react'
import { useKonamiCode } from './useKonamiCode'

export function useEasterEggs() {
  const [appealsUnlocked, setAppealsUnlocked] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(1)
  const [golfBallRain, setGolfBallRain] = useState(false)
  const [contempt, setContempt] = useState(false)
  const [gooseAnger, setGooseAnger] = useState(0)
  const [judgeClicks, setJudgeClicks] = useState(0)
  const [typedBuffer, setTypedBuffer] = useState('')

  useKonamiCode(useCallback(() => setAppealsUnlocked(true), []))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const key = e.key.toUpperCase()
      const next = (typedBuffer + key).slice(-4)
      setTypedBuffer(next)
      if (next === 'FORE') {
        setGolfBallRain(true)
        setTypedBuffer('')
        setTimeout(() => setGolfBallRain(false), 4000)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [typedBuffer])

  const clickGlowBall = useCallback(() => {
    setGlowIntensity((v) => Math.min(v + 0.35, 8))
  }, [])

  const clickJudge = useCallback(() => {
    setJudgeClicks((c) => {
      const next = c + 1
      if (next >= 10) setContempt(true)
      return next
    })
  }, [])

  const clickGoose = useCallback(() => {
    setGooseAnger((a) => Math.min(a + 1, 5))
  }, [])

  return {
    appealsUnlocked,
    glowIntensity,
    golfBallRain,
    contempt,
    gooseAnger,
    judgeClicks,
    clickGlowBall,
    clickJudge,
    clickGoose,
  }
}
