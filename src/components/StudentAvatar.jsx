import React from 'react';
import ImageWithFallback from './ImageWithFallback';

/**
 * Student avatar component with Google Drive fallback handling
 */
const StudentAvatar = ({ 
  src, 
  alt = 'Student Avatar', 
  className = 'w-10 h-10 rounded-full',
  fallbackSrc = 'https://via.placeholder.com/40x40?text=U',
  ...props 
}) => {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
      {...props}
    />
  );
};

export default StudentAvatar;
