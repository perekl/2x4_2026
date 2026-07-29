import { motion } from 'framer-motion'

export function AppealsCourt() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9000] bg-midnight flex items-center justify-center p-8"
    >
      <div className="max-w-lg text-center border-4 border-brass/40 p-10 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-midnight px-4">
          <span className="font-mono text-xs text-brass tracking-[0.4em]">SECRET UNLOCK</span>
        </div>
        <h2 className="font-display text-3xl text-brass mb-4">Appeals Court</h2>
        <p className="font-mono text-sm text-paper/60 leading-relaxed mb-6">
          Motion denied. The court finds that 18 holes of golf is, in fact, 
          a proportional sentence for unauthorized glow-in-the-dark recreation.
        </p>
        <p className="font-mono text-xs text-neon">
          Nice try, counselor. See you on the fairway.
        </p>
        <p className="font-mono text-[10px] text-paper/30 mt-6">Konami Code Accepted ✓</p>
      </div>
    </motion.section>
  )
}
