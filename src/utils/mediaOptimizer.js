/**
 * Media Optimization Utility
 * 
 * Dynamically rewrites image URLs from hosting providers (Unsplash, Cloudinary)
 * to apply custom widths, browser-supported formatting (e.g. WebP), and optimal compression quality.
 * Reduces page weight and improves load performance for portfolios with hundreds of assets.
 */

export function getOptimizedImageUrl(url, width = 800) {
  const fallbackImage = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80';
  
  if (!url) return fallbackImage;
  
  try {
    // Unsplash Optimization
    if (url.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', '80');
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    }
    
    // Cloudinary Optimization
    if (url.includes('res.cloudinary.com')) {
      if (url.includes('/upload/')) {
        // Insert width, auto format, auto quality transformations
        return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
      }
    }
  } catch (error) {
    console.warn("Failed to optimize media URL, using fallback/original:", error);
  }
  
  return url;
}
