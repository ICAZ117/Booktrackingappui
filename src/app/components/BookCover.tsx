import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookCoverProps {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper around ImageWithFallback that only passes valid cover URLs
 * This prevents console warnings for books without covers
 */
export function BookCover({ src, alt, className, style }: BookCoverProps) {
  const normalizedSrc = src?.startsWith('http://') ? src.replace('http://', 'https://') : src;

  // Only pass src to ImageWithFallback if it's a valid URL
  // This prevents the console.warn in ImageWithFallback for missing covers
  const validSrc = normalizedSrc && normalizedSrc.length > 0 && normalizedSrc.startsWith('http')
    ? normalizedSrc
    : undefined;
  
  return (
    <ImageWithFallback 
      src={validSrc} 
      alt={alt} 
      className={className} 
      style={style}
      suppressWarning={true}
    />
  );
}
