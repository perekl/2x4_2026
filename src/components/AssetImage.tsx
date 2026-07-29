import { useEffect, useState } from 'react'

interface AssetImageProps {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
  label?: string
}

export function AssetImage({ src, alt, className = '', fallbackClassName = '', label }: AssetImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setError(false)
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setError(true)
    img.src = src
  }, [src])

  if (error || !loaded) {
    return (
      <div
        className={`asset-fallback flex items-center justify-center ${fallbackClassName || className}`}
        aria-label={alt}
      >
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-brass/40 border-dashed flex items-center justify-center">
            <span className="text-neon text-xs font-mono">IMG</span>
          </div>
          <p className="text-paper/40 text-xs font-mono uppercase tracking-wider">{label || alt}</p>
          <p className="text-paper/25 text-[10px] font-mono mt-1 break-all max-w-[140px]">{src}</p>
        </div>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />
}
