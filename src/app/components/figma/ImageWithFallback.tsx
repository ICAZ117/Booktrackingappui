import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  suppressWarning?: boolean;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`❌ ImageWithFallback: Failed to load image for "${alt}"`, {
      src: src,
      error: e.type,
      // Don't log the element directly - it contains circular references
    });
    setDidError(true)
  }

  const { src, alt, style, className, suppressWarning, ...rest } = props
  
  // Handle empty, undefined, or invalid src
  const hasValidSrc = src && src.length > 0 && (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/'));
  
  // Log for debugging (only if suppressWarning is explicitly false)
  // By default, don't warn for missing covers as they're expected and handled with fallback
  if (!hasValidSrc && suppressWarning === false) {
    console.warn(`⚠️ ImageWithFallback: Invalid or missing src for "${alt}"`, { src });
  }

  return didError || !hasValidSrc ? (
    <div
      className={`inline-block bg-gray-200 text-center align-middle ${className ?? ''}`}
      style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <img 
        src={ERROR_IMG_SRC} 
        alt="No cover available" 
        className="w-12 h-12 opacity-30"
        loading="lazy"
        decoding="async"
        data-original-url={src}
        data-error-reason={!hasValidSrc ? 'invalid-src' : 'load-error'}
      />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} loading="lazy" decoding="async" {...rest} onError={handleError} />
  )
}
