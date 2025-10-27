import React, { useState, useCallback, useEffect } from 'react';
import { getThumbnailUrl } from '../utils/imageUtils';

/**
 * Image component with Google Drive fallback handling
 */
const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://via.placeholder.com/400x300?text=No+Image',
  ...props 
}) => {
  const formattedSource = getThumbnailUrl({ image_url: src }) || src;
  const [currentSrc, setCurrentSrc] = useState(formattedSource);
  const [errorCount, setErrorCount] = useState(0);

  // Reset when src changes
  useEffect(() => {
    const newFormattedSrc = getThumbnailUrl({ image_url: src }) || src;
    setCurrentSrc(newFormattedSrc);
    setErrorCount(0);
  }, [src]);

  const handleError = useCallback((e) => {
    console.log('Image failed to load:', e.target.src);
    
    setErrorCount(prev => {
      const newCount = prev + 1;
      
      // Try alternative Google Drive URL format if current one failed
      if (e.target.src.includes('drive.google.com/thumbnail') && newCount === 1) {
        const fileIdMatch = e.target.src.match(/id=([a-zA-Z0-9-_]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          const alternativeUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          console.log('Trying alternative URL:', alternativeUrl);
          setCurrentSrc(alternativeUrl);
          return newCount;
        }
      }
      
      // If all else fails, use placeholder
      if (newCount >= 2) {
        console.log('Using placeholder image');
        setCurrentSrc(fallbackSrc);
      }
      
      return newCount;
    });
  }, [fallbackSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
