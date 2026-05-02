// ========================================
// SIMPLE GOOGLE PHOTOS INTEGRATION
// Using Google Photos Embed Widget
// ========================================

// Your album details
const GOOGLE_PHOTOS_CONFIG = {
  albumUrl: 'https://photos.app.goo.gl/PKbE1PDMfGqYrhsw8',
  // These are extracted from your album URL
  albumId: 'AF1QipPY8TozdyhgYLansR0eDRt8HImVNnmK_Q7Q-VTBetCRWp1bVaqLlD-atFfxBRipWg',
  albumKey: 'S0RoU3diM2J3cHM4UUF6NjA0QnpnOHhHRTNVMlVn'
};

// Generate direct Google Photos image URLs
function generateGooglePhotosUrls() {
  // These are the actual photo IDs from your album (from the web fetch)
  const photoIds = [
    'AF1QipND6Rj2hsN_x8Ys60AzlyrMT8NZHcDcAdaU4Hho', // Video
    'AF1QipNwpr2Q6GXdmbHC2ruszq2Gxcd05xosAOeBKaa-', // Square photo
    'AF1QipPjvkdouXs1uFV4zpVlxAIct2NlQipn2baiIZOF', // Portrait
    'AF1QipMlehVuV7UqcZE_Z5cBpaXJ0TFz3p-L604IBCeb', // Portrait
    'AF1QipOomVmxcV_nNqsLZAQmfP-69aidQm4xqsswAUMc', // Portrait
    'AF1QipP382epx2wxzX7oFRjNGDGMw9xCGdJLqCEmAqh6', // Portrait
    'AF1QipPkWOMcnjLlkDnGaotVDxkJACXDNdBMlE6lcDNO', // Portrait
    'AF1QipMjzBFn37RjAdjc02sSWnleqge-5_kRhgiIl4Bj', // Landscape
    'AF1QipPuJ0iUmUZWJ20HUzziVyEhnEciHRqDsymeHktJ', // Landscape
    'AF1QipMIO3QNNfV8zNfyohP9K-CrIrLOAzA2jrvN5dlV', // Landscape
    'AF1QipPOklMgnOxCdkqMZ15yOQHQB_3UmQDcFCjV36nh', // Landscape
    'AF1QipMKCrMep0PNGIRx2lsuHFtwG8OBEs6HFWNieA6O', // Portrait
    'AF1QipM8bGUqasHkY03NbeEcNe2k9h8a-p4UxiSBu-sT', // Portrait
    'AF1QipOgtRpnU73BZoB5GFqJzlW2-gnhVBkVmH17CaE-', // Portrait
    'AF1QipP22Ctp6fqAUHKg7gSfqylE84Dwryyju7m032yD', // Portrait
    'AF1QipM19ux7rdWXSJYMgNmzQ1FEjOCJEtK1HlwI216c', // Portrait
    'AF1QipNoE9yg-HJ7BzUahH3EPfFI0V8lzDKyjh24W-UD', // Portrait
    'AF1QipNpQddllM1XXcmfbF-EYHr1E2cnuxHVflqA4OH_', // Portrait
    'AF1QipPe5hE8UM5xCysMNSjakS4TjDeUxd9HMCOxD9Xb', // Portrait
    'AF1QipNAECGKEOapm3pCdKxGlpl5VbAWf3582JKdy549', // Portrait
    'AF1QipMkw_ZuiCSqn4CUmEOXx2_g5CNbb15yuG7YQ1Aa', // Square
    'AF1QipMzxT9gBRDC2EXngfrTYvQPpWBl8O7iY3bbtE34', // Portrait
    'AF1QipM9liYcowL-7yzDPNgABh__rM4Q2qrm2c9lkTyg', // Portrait
    'AF1QipOyNMMXXznUHLoq54XWgay9YBVHhrbPSAile3Z5', // Square
    'AF1QipMx-zc8ym6RzvKrYsr8Vr0urIfIsveTLBJ78hvn', // Square
    'AF1QipNGf3phL7ZU6aZDjDU9tCm_V0E2MiKfQpzNZBAJ', // Landscape
    'AF1QipMNg3ijn1ecsOzLN0b0W5Z2-cxPwkfODFmg-K6e', // Landscape
    'AF1QipNOSqeHZ4hu5aqoSsQ_A5tFWl5vc5kNmN2UHljb', // Square
    'AF1QipOk2xGI0uCGKz1fqsLlgm1KRQ1ZPoGQUcJr8MHD', // Square
    'AF1QipMi48VfhjgTl0KUvewm5UPYGVvakSxm_CrWUszp', // Square
  ];
  
  return photoIds.map(photoId => {
    const baseUrl = `https://lh3.googleusercontent.com/pw/${photoId}`;
    return {
      url: `${baseUrl}=w1080-h1080-p-k-no`,
      thumbnail: `${baseUrl}=w400-h400-p-k-no`
    };
  });
}

// Create portfolio projects from Google Photos
function createGooglePhotosProjects() {
  const photos = generateGooglePhotosUrls();
  const categories = ['branding', 'web', 'photo', 'social', 'video'];
  const titles = [
    'Brand Identity Design',
    'Logo Design',
    'Corporate Branding',
    'Social Media Campaign',
    'Website Design',
    'Product Photography',
    'Event Coverage',
    'Marketing Materials',
    'Digital Campaign',
    'Creative Design',
    'Brand Strategy',
    'Visual Identity',
    'Content Creation',
    'Graphic Design',
    'Photography Project',
    'Web Development',
    'UI/UX Design',
    'Print Design',
    'Advertising Campaign',
    'Creative Project',
    'Brand Development',
    'Digital Marketing',
    'Social Media Design',
    'Corporate Identity',
    'Product Design',
    'Event Design',
    'Marketing Strategy',
    'Visual Communication',
    'Brand Experience',
    'Creative Strategy'
  ];
  
  return photos.map((photo, index) => ({
    title: titles[index] || `Project ${index + 1}`,
    description: 'Creative work by ProVenture Digital Agency',
    category: categories[index % categories.length],
    type: 'image',
    url: photo.url
  }));
}

// Initialize
function initSimpleGooglePhotos() {
  try {
    const projects = createGooglePhotosProjects();
    console.log(`✅ Loaded ${projects.length} projects from Google Photos`);
    return projects;
  } catch (error) {
    console.error('❌ Error loading Google Photos:', error);
    return null;
  }
}

// Export
window.initSimpleGooglePhotos = initSimpleGooglePhotos;
