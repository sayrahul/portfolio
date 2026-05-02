// ========================================
// GOOGLE PHOTOS LOADER
// Automatically fetch images from Google Photos
// ========================================

// Your Google Photos Album ID
const ALBUM_URL = 'https://photos.app.goo.gl/PKbE1PDMfGqYrhsw8';

// Extract album ID from URL
function getAlbumId(url) {
  const match = url.match(/\/([a-zA-Z0-9_-]+)$/);
  return match ? match[1] : null;
}

// Fetch images from Google Photos using embed method
async function loadGooglePhotos() {
  try {
    const albumId = getAlbumId(ALBUM_URL);
    
    // Method 1: Use Google Photos embed
    const embedUrl = `https://photos.google.com/share/${albumId}`;
    
    // Fetch the album page
    const response = await fetch(embedUrl);
    const html = await response.text();
    
    // Parse image URLs from the HTML
    const imageUrls = extractImageUrls(html);
    
    return imageUrls;
  } catch (error) {
    console.error('Error loading Google Photos:', error);
    return [];
  }
}

// Extract image URLs from HTML
function extractImageUrls(html) {
  const urls = [];
  const regex = /https:\/\/lh3\.googleusercontent\.com\/[^"'\s]+/g;
  const matches = html.match(regex);
  
  if (matches) {
    matches.forEach(url => {
      // Clean and format URL
      const cleanUrl = url.split('=')[0] + '=w1080-h1080';
      if (!urls.includes(cleanUrl)) {
        urls.push(cleanUrl);
      }
    });
  }
  
  return urls;
}

// Convert to portfolio projects
function convertToProjects(imageUrls) {
  return imageUrls.map((url, index) => ({
    title: `Project ${index + 1}`,
    description: 'ProVenture creative work',
    category: getCategoryByIndex(index),
    type: 'image',
    url: url
  }));
}

// Distribute categories evenly
function getCategoryByIndex(index) {
  const categories = ['branding', 'video', 'web', 'photo', 'social'];
  return categories[index % categories.length];
}

// Export for use in main.js
window.loadGooglePhotos = loadGooglePhotos;
window.convertToProjects = convertToProjects;
