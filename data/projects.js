// ========================================
// PORTFOLIO PROJECTS DATA
// Auto-populated from Google Photos
// ========================================

// Your Google Photos Album
const GOOGLE_PHOTOS_ALBUM = 'https://photos.app.goo.gl/PKbE1PDMfGqYrhsw8';

// Sample projects with direct image URLs
// Replace these with your actual image URLs from Imgur or other host
const portfolioProjects = [
  // BRANDING PROJECTS
  {
    title: 'Brand Identity Design',
    description: 'Complete brand identity package',
    category: 'branding',
    type: 'image',
    url: 'https://lh3.googleusercontent.com/d/1PKbE1PDMfGqYrhsw8' // Replace with actual URL
  },
  {
    title: 'Logo Design Collection',
    description: 'Modern logo designs',
    category: 'branding',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Logo+Design'
  },
  {
    title: 'Corporate Branding',
    description: 'Full corporate identity',
    category: 'branding',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Corporate'
  },
  {
    title: 'Packaging Design',
    description: 'Product packaging design',
    category: 'branding',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Packaging'
  },
  {
    title: 'Brand Guidelines',
    description: 'Comprehensive brand book',
    category: 'branding',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Guidelines'
  },
  
  // VIDEO PROJECTS
  {
    title: 'Corporate Video',
    description: 'Professional corporate video production',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    title: 'Product Showcase',
    description: 'Dynamic product showcase video',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    title: 'Social Media Reel',
    description: 'Engaging social media content',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    title: 'Motion Graphics',
    description: 'Animated motion graphics',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    title: 'Explainer Video',
    description: 'Animated explainer video',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  
  // WEB DESIGN PROJECTS
  {
    title: 'E-commerce Website',
    description: 'Modern e-commerce platform design',
    category: 'web',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=E-commerce'
  },
  {
    title: 'Corporate Website',
    description: 'Professional corporate website',
    category: 'web',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Corporate+Web'
  },
  {
    title: 'Portfolio Website',
    description: 'Creative portfolio website design',
    category: 'web',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Portfolio'
  },
  {
    title: 'Landing Page Design',
    description: 'High-converting landing page',
    category: 'web',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Landing+Page'
  },
  {
    title: 'Mobile App UI',
    description: 'Mobile app interface design',
    category: 'web',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Mobile+App'
  },
  
  // PHOTOGRAPHY PROJECTS
  {
    title: 'Product Photography',
    description: 'Professional product photography',
    category: 'photo',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Product+Photo'
  },
  {
    title: 'Corporate Event',
    description: 'Corporate event photography',
    category: 'photo',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Event'
  },
  {
    title: 'Brand Photography',
    description: 'Brand lifestyle photography',
    category: 'photo',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Brand+Photo'
  },
  {
    title: 'Portrait Photography',
    description: 'Professional portrait session',
    category: 'photo',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Portrait'
  },
  {
    title: 'Event Coverage',
    description: 'Complete event photography',
    category: 'photo',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Event+Coverage'
  },
  
  // SOCIAL MEDIA PROJECTS
  {
    title: 'Instagram Campaign',
    description: 'Social media campaign design',
    category: 'social',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Instagram'
  },
  {
    title: 'Social Media Graphics',
    description: 'Engaging social media graphics',
    category: 'social',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Social+Graphics'
  },
  {
    title: 'Content Strategy',
    description: 'Complete social media content',
    category: 'social',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=Content'
  },
  {
    title: 'Facebook Ads',
    description: 'High-performing ad creatives',
    category: 'social',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/1B3A5C/ffffff?text=Facebook+Ads'
  },
  {
    title: 'LinkedIn Content',
    description: 'Professional LinkedIn graphics',
    category: 'social',
    type: 'image',
    url: 'https://via.placeholder.com/600x600/00AEEF/ffffff?text=LinkedIn'
  },
];

// ========================================
// HOW TO ADD YOUR IMAGES:
// ========================================
// 
// EASIEST METHOD: Use Imgur
// 
// 1. Download images from Google Photos
// 2. Go to imgur.com
// 3. Upload all images
// 4. Right-click each image → "Copy image address"
// 5. Replace the placeholder URLs above
//
// Example:
// url: 'https://i.imgur.com/ABC123.jpg'
//
// ========================================
