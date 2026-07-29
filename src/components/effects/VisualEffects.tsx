export function FilmGrain() {
  return (
    <div className="film-grain pointer-events-none fixed inset-0 z-[9998]" aria-hidden="true" />
  )
}

export function SirenReflection() {
  return (
    <div className="siren-reflection pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
  )
}

export function FluorescentFlicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`fluorescent-flicker ${className}`}>{children}</div>
}
