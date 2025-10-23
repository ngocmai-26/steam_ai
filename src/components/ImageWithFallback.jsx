import React, { useCallback } from 'react';
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
  const handleError = useCallback((e) => {
    console.log('Image failed to load:', e.target.src);
    
    // Try alternative Google Drive URL format if current one failed
    if (e.target.src.includes('drive.google.com/thumbnail')) {
      const fileIdMatch = e.target.src.match(/id=([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        const alternativeUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log('Trying alternative URL:', alternativeUrl);
        e.target.src = alternativeUrl;
        return;
      }
    }
    
    // If all else fails, use placeholder
    if (e.target.src !== fallbackSrc) {
      console.log('Using placeholder image');
      e.target.src = fallbackSrc;
    }
  }, [fallbackSrc]);

  // Format the source URL if it's a Google Drive URL
  const formattedSrc = getThumbnailUrl({ image_url: src }) || src;

  return (
    <img
      src={formattedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
