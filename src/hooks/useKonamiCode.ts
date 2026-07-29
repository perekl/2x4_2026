import { useEffect, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
]

export function useKonamiCode(onActivate: () => void) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === KONAMI[index]) {
        const next = index + 1
        if (next === KONAMI.length) {
          onActivate()
          setIndex(0)
        } else {
          setIndex(next)
        }
      } else {
        setIndex(e.code === KONAMI[0] ? 1 : 0)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, onActivate])
}
