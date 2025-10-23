/**
 * Utility functions for handling image URLs and display
 */

/**
 * Format Google Drive URL to be more user-friendly
 * @param {string} url - The original URL
 * @returns {string} - Formatted URL
 */
export const formatImageUrl = (url) => {
  if (!url) return null;
  
  // If it's a Google Drive URL, convert to direct image URL
  if (url.includes('drive.google.com/file/d/')) {
    // Extract file ID from various Google Drive URL formats
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Try multiple Google Drive image URL formats
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`;
    }
  }
  
  // If it's already a Google Drive direct image URL, return as is
  if (url.includes('drive.google.com/uc?export=view') || url.includes('drive.google.com/thumbnail')) {
    return url;
  }
  
  // For other URLs, return as is
  return url;
};

/**
 * Get a clean, short display name for the image URL
 * @param {string} url - The original URL
 * @returns {string} - Short display name
 */
export const getImageDisplayName = (url) => {
  if (!url) return 'Không có ảnh';
  
  if (url.includes('drive.google.com')) {
    return 'Ảnh từ Google Drive';
  }
  
  if (url.includes('localhost')) {
    return 'Ảnh local';
  }
  
  // Extract filename from URL
  const filename = url.split('/').pop();
  if (filename && filename.includes('.')) {
    return filename;
  }
  
  return 'Ảnh đã tải lên';
};

/**
 * Check if URL is a valid image URL
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL is valid for images
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  const isGoogleDrive = url.includes('drive.google.com');
  const isLocalhost = url.includes('localhost');
  
  return hasImageExtension || isGoogleDrive || isLocalhost;
};

/**
 * Get thumbnail URL with fallback
 * @param {object} item - The item object
 * @returns {string|null} - The thumbnail URL or null
 */
export const getThumbnailUrl = (item) => {
  if (!item) return null;
  
  const thumbnailUrl = item.thumbnail_url || item.thumbnail || item.image_url;
  if (!thumbnailUrl) return null;
  
  // If it's a Google Drive URL, try multiple formats
  if (thumbnailUrl.includes('drive.google.com')) {
    const fileIdMatch = thumbnailUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Return the most reliable Google Drive thumbnail URL
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`;
    }
  }
  
  return formatImageUrl(thumbnailUrl);
};

/**
 * Get multiple fallback URLs for Google Drive images
 * @param {string} url - The original URL
 * @returns {string[]} - Array of fallback URLs
 */
export const getGoogleDriveFallbackUrls = (url) => {
  if (!url || !url.includes('drive.google.com')) return [url];
  
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (!fileIdMatch || !fileIdMatch[1]) return [url];
  
  const fileId = fileIdMatch[1];
  return [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    url // Original URL as last resort
  ];
};

/**
 * Get placeholder image URL
 * @param {string} text - Text to display in placeholder
 * @param {number} width - Width of placeholder
 * @param {number} height - Height of placeholder
 * @returns {string} - Placeholder URL
 */
export const getPlaceholderImage = (text = 'No Image', width = 400, height = 300) => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};
