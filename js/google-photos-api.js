// ========================================
// GOOGLE PHOTOS API INTEGRATION
// Fetch images directly from Google Photos
// ========================================

// Configuration
const CONFIG = {
  albumUrl: 'https://photos.app.goo.gl/PKbE1PDMfGqYrhsw8',
  // Extract the key from your album URL
  albumKey: 'S0RoU3diM2J3cHM4UUF6NjA0QnpnOHhHRTNVMlVn',
  albumId: 'AF1QipPY8TozdyhgYLansR0eDRt8HImVNnmK_Q7Q-VTBetCRWp1bVaqLlD-atFfxBRipWg'
};

// Google Photos public feed URL
function getPhotosFeedUrl() {
  return `https://photos.google.com/share/${CONFIG.albumId}?key=${CONFIG.albumKey}`;
}

// Fetch photos from Google Photos
async function fetchGooglePhotos() {
  try {
    console.log('Fetching photos from Google Photos...');
    
    // Use CORS proxy to fetch the album
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const albumUrl = encodeURIComponent(getPhotosFeedUrl());
    const response = await fetch(proxyUrl + albumUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch album');
    }
    
    const html = await response.text();
    const photos = parsePhotosFromHtml(html);
    
    console.log(`Found ${photos.length} photos`);
    return photos;
    
  } catch (error) {
    console.error('Error fetching Google Photos:', error);
    return [];
  }
}

// Parse photo URLs from HTML
function parsePhotosFromHtml(html) {
  const photos = [];
  
  // Match Google Photos image URLs
  const urlPattern = /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+/g;
  const matches = html.match(urlPattern);
  
  if (matches) {
    const uniqueUrls = [...new Set(matches)];
    
    uniqueUrls.forEach((url, index) => {
      // Add size parameter for better quality
      const photoUrl = url + '=w1080-h1080-c';
      
      photos.push({
        id: index,
        url: photoUrl,
        thumbnail: url + '=w400-h400-c',
        title: `Project ${index + 1}`,
        description: 'ProVenture creative work'
      });
    });
  }
  
  return photos;
}

// Convert photos to portfolio projects
function convertToPortfolioProjects(photos) {
  const categories = ['branding', 'web', 'photo', 'social', 'video'];
  
  return photos.map((photo, index) => ({
    title: photo.title || `Project ${index + 1}`,
    description: photo.description || 'Creative work by ProVenture',
    category: categories[index % categories.length],
    type: 'image',
    url: photo.url
  }));
}

// Initialize and load photos
async function initGooglePhotos() {
  try {
    const photos = await fetchGooglePhotos();
    
    if (photos.length > 0) {
      const projects = convertToPortfolioProjects(photos);
      return projects;
    } else {
      console.warn('No photos found, using fallback data');
      return null;
    }
  } catch (error) {
    console.error('Error initializing Google Photos:', error);
    return null;
  }
}

// Export functions
window.initGooglePhotos = initGooglePhotos;
window.fetchGooglePhotos = fetchGooglePhotos;
