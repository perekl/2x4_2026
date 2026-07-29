import { useEffect, useRef, useState, useCallback } from 'react'
import { SectionHeader } from './Suspects'

type Entity = { x: number; y: number; type: 'groundskeeper' | 'sprinkler' | 'goose'; angle?: number; speed?: number }
type Collectible = { x: number; y: number; type: 'ball' | 'tee' | 'marker'; collected: boolean }

const W = 600
const H = 400
const PLAYER_SIZE = 16
const PLAYER_SPEED = 3

export function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)
  const [caught, setCaught] = useState(false)
  const [score, setScore] = useState({ balls: 0, tees: 0, markers: 0 })
  const [gameOver, setGameOver] = useState(false)
  const stateRef = useRef({
    player: { x: W / 2, y: H - 40 },
    keys: {} as Record<string, boolean>,
    entities: [] as Entity[],
    collectibles: [] as Collectible[],
    frame: 0,
  })

  const initGame = useCallback(() => {
    stateRef.current = {
      player: { x: W / 2, y: H - 40 },
      keys: {},
      entities: [
        { x: 100, y: 100, type: 'groundskeeper', angle: 0, speed: 1.5 },
        { x: 400, y: 200, type: 'groundskeeper', angle: Math.PI, speed: 1.2 },
        { x: 200, y: 300, type: 'sprinkler' },
        { x: 450, y: 150, type: 'sprinkler' },
        { x: 300, y: 80, type: 'goose', angle: 0, speed: 2 },
        { x: 500, y: 320, type: 'goose', angle: Math.PI / 2, speed: 1.8 },
      ],
      collectibles: Array.from({ length: 8 }, (_, i) => ({
        x: 50 + (i % 4) * 140 + Math.random() * 40,
        y: 50 + Math.floor(i / 4) * 150 + Math.random() * 40,
        type: (['ball', 'tee', 'marker'] as const)[i % 3],
        collected: false,
      })),
      frame: 0,
    }
    setScore({ balls: 0, tees: 0, markers: 0 })
    setCaught(false)
    setGameOver(false)
  }, [])

  const startGame = () => {
    initGame()
    setPlaying(true)
  }

  const restartGame = () => {
    startGame()
  }

  useEffect(() => {
    if (!playing) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const onKey = (e: KeyboardEvent, down: boolean) => {
      stateRef.current.keys[e.key] = down
      e.preventDefault()
    }
    const kd = (e: KeyboardEvent) => onKey(e, true)
    const ku = (e: KeyboardEvent) => onKey(e, false)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)

    let animId: number

    const loop = () => {
      const s = stateRef.current
      s.frame++

      const { keys, player, entities, collectibles } = s
      if (keys['ArrowUp'] || keys['w']) player.y -= PLAYER_SPEED
      if (keys['ArrowDown'] || keys['s']) player.y += PLAYER_SPEED
      if (keys['ArrowLeft'] || keys['a']) player.x -= PLAYER_SPEED
      if (keys['ArrowRight'] || keys['d']) player.x += PLAYER_SPEED
      player.x = Math.max(PLAYER_SIZE, Math.min(W - PLAYER_SIZE, player.x))
      player.y = Math.max(PLAYER_SIZE, Math.min(H - PLAYER_SIZE, player.y))

      entities.forEach((ent) => {
        if (ent.type === 'groundskeeper' && ent.angle !== undefined && ent.speed) {
          ent.x += Math.cos(ent.angle) * ent.speed
          ent.y += Math.sin(ent.angle) * ent.speed
          if (ent.x < 30 || ent.x > W - 30) ent.angle = Math.PI - ent.angle!
          if (ent.y < 30 || ent.y > H - 30) ent.angle = -ent.angle!
        }
        if (ent.type === 'goose' && ent.angle !== undefined && ent.speed) {
          ent.angle += 0.03
          ent.x += Math.cos(ent.angle) * ent.speed
          ent.y += Math.sin(ent.angle) * ent.speed
          if (ent.x < 20 || ent.x > W - 20) ent.speed! *= -1
          if (ent.y < 20 || ent.y > H - 20) ent.speed! *= -1
        }
        if (ent.type === 'sprinkler' && s.frame % 120 < 60) {
          const dx = player.x - ent.x
          const dy = player.y - ent.y
          if (Math.hypot(dx, dy) < 40) {
            setCaught(true)
            setGameOver(true)
            setPlaying(false)
          }
        }
        const dx = player.x - ent.x
        const dy = player.y - ent.y
        if (ent.type === 'groundskeeper' && Math.hypot(dx, dy) < 50) {
          const angle = Math.atan2(dy, dx)
          const cone = Math.abs(((angle - (ent.angle ?? 0) + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
          if (cone < 0.5 && Math.hypot(dx, dy) < 120) {
            setCaught(true)
            setGameOver(true)
            setPlaying(false)
          }
        }
        if (ent.type === 'goose' && Math.hypot(dx, dy) < 25) {
          setCaught(true)
          setGameOver(true)
          setPlaying(false)
        }
      })

      collectibles.forEach((c) => {
        if (!c.collected && Math.hypot(player.x - c.x, player.y - c.y) < 20) {
          c.collected = true
          setScore((prev) => ({
            balls: prev.balls + (c.type === 'ball' ? 1 : 0),
            tees: prev.tees + (c.type === 'tee' ? 1 : 0),
            markers: prev.markers + (c.type === 'marker' ? 1 : 0),
          }))
        }
      })

      if (collectibles.every((c) => c.collected)) {
        setGameOver(true)
        setPlaying(false)
      }

      // Draw
      ctx.fillStyle = '#0a1628'
      ctx.fillRect(0, 0, W, H)

      // Fairway stripes
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#0d2818' : '#0a1f12'
        ctx.fillRect(0, i * (H / 8), W, H / 8)
      }

      // Collectibles
      collectibles.forEach((c) => {
        if (c.collected) return
        ctx.beginPath()
        if (c.type === 'ball') {
          ctx.fillStyle = '#39ff14'
          ctx.arc(c.x, c.y, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowColor = '#39ff14'
          ctx.shadowBlur = 10
        } else if (c.type === 'tee') {
          ctx.fillStyle = '#c9a227'
          ctx.moveTo(c.x, c.y - 8)
          ctx.lineTo(c.x - 4, c.y + 4)
          ctx.lineTo(c.x + 4, c.y + 4)
          ctx.fill()
        } else {
          ctx.fillStyle = '#fff'
          ctx.arc(c.x, c.y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
      })

      // Entities
      entities.forEach((ent) => {
        if (ent.type === 'groundskeeper') {
          ctx.save()
          ctx.translate(ent.x, ent.y)
          ctx.rotate(ent.angle ?? 0)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 100)
          grad.addColorStop(0, 'rgba(255,255,200,0.3)')
          grad.addColorStop(1, 'rgba(255,255,200,0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.arc(0, 0, 100, -0.4, 0.4)
          ctx.fill()
          ctx.fillStyle = '#8b4513'
          ctx.fillRect(-6, -6, 12, 12)
          ctx.restore()
        } else if (ent.type === 'sprinkler') {
          if (s.frame % 120 < 60) {
            ctx.strokeStyle = 'rgba(100,180,255,0.5)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(ent.x, ent.y, 35, 0, Math.PI * 2)
            ctx.stroke()
          }
          ctx.fillStyle = '#555'
          ctx.fillRect(ent.x - 4, ent.y - 4, 8, 8)
        } else {
          ctx.font = '20px serif'
          ctx.fillText('🪿', ent.x - 10, ent.y + 7)
        }
      })

      // Player
      ctx.fillStyle = '#c9a227'
      ctx.beginPath()
      ctx.arc(player.x, player.y, PLAYER_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#39ff14'
      ctx.beginPath()
      ctx.arc(player.x, player.y - 8, 3, 0, Math.PI * 2)
      ctx.fill()

      if (playing) animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [playing, initGame])

  return (
    <section id="mini-game" className="section-padding">
      <div className="container-max">
        <SectionHeader
          tag="FIELD OPERATION"
          title="Night Infiltration"
          subtitle="Collect evidence. Avoid detection. WASD or arrow keys."
        />

        <div className="mt-12 flex flex-col items-center">
          <div className="relative border-2 border-brass/30 rounded-lg overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={W} height={H} className="block max-w-full" />
            {!playing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 px-6">
                {gameOver ? (
                  <>
                    {caught ? (
                      <p className="border-4 border-red-600 text-red-500 font-display text-xl px-6 py-2 rotate-[-3deg]">
                        SENTENCE INCREASED.
                      </p>
                    ) : (
                      <p className="text-neon font-mono text-sm text-center">
                        All evidence collected. Return to base.
                      </p>
                    )}
                    <button onClick={restartGame} className="nav-btn px-8 py-3 w-auto">
                      RESTART MISSION
                    </button>
                  </>
                ) : (
                  <button onClick={startGame} className="nav-btn px-8 py-3 w-auto">
                    BEGIN INFILTRATION
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <div className="flex gap-6 font-mono text-sm">
              <span className="text-neon">Balls: {score.balls}</span>
              <span className="text-brass">Tees: {score.tees}</span>
              <span className="text-paper/60">Markers: {score.markers}</span>
            </div>
            {playing && (
              <button
                onClick={restartGame}
                className="font-mono text-xs tracking-widest text-paper/40 hover:text-brass border border-paper/20 hover:border-brass/40 px-4 py-2 transition-colors"
              >
                RESTART
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
