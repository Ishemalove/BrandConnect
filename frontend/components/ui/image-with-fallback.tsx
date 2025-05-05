"use client"

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
}

/**
 * Image component with built-in fallback handling
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Reset error state when src changes
    setError(false)
    
    // Handle different src types
    if (!src) {
      setImgSrc(fallbackSrc)
      return
    }
    
    // Check if the src is valid
    if (typeof src === 'string') {
      // Check if it's a data URL (base64)
      if (src.startsWith('data:')) {
        setImgSrc(src)
        return
      }
      
      // Check if URL is valid by looking for common image extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
      const hasValidExtension = validExtensions.some(ext => 
        src.toLowerCase().includes(ext)
      )
      
      // Check for protocol - valid URLs should have http://, https://, or // at the start
      const hasValidProtocol = src.startsWith('http://') || 
                              src.startsWith('https://') || 
                              src.startsWith('//')
      
      if (hasValidProtocol || hasValidExtension || src.startsWith('/')) {
        setImgSrc(src)
      } else {
        console.warn(`Potentially invalid image URL: ${src}`)
        setImgSrc(src) // Try anyway, but be prepared for fallback
      }
    } else {
      // If src is not a string, use it directly (Next.js allows some other types)
      setImgSrc(src as any)
    }
  }, [src, fallbackSrc])

  const handleError = () => {
    console.warn(`Image failed to load: ${src}`)
    setImgSrc(fallbackSrc)
    setError(true)
  }

  if (!imgSrc) {
    return null // Don't render until we've determined the proper source
  }

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={true}
      className={`${rest.className || ''} ${error ? 'fallback-image' : ''}`}
    />
  )
} 