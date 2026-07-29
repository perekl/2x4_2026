import { motion } from 'framer-motion'

export function GolfBallRain() {
  const balls = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 8 + Math.random() * 16,
  }))

  return (
    <div className="fixed inset-0 z-[8000] pointer-events-none overflow-hidden">
      {balls.map((ball) => (
        <motion.div
          key={ball.id}
          className="absolute rounded-full bg-neon"
          style={{
            left: `${ball.left}%`,
            width: ball.size,
            height: ball.size,
            boxShadow: '0 0 10px #39ff14',
          }}
          initial={{ top: '-5%', opacity: 1 }}
          animate={{ top: '105%', opacity: 0.3 }}
          transition={{ duration: ball.duration, delay: ball.delay, ease: 'linear' }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="font-display text-6xl text-neon glow-text"
        >
          FORE!
        </motion.p>
      </div>
    </div>
  )
}
