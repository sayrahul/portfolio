// ========================================
// PORTFOLIO PROJECTS DATA
// Default dataset / Fallback from Google Photos
// ========================================

const GOOGLE_PHOTOS_ALBUM = 'https://photos.app.goo.gl/PKbE1PDMfGqYrhsw8';

const portfolioProjects = [
  // BRANDING PROJECTS
  {
    title: 'Brand Identity Design',
    description: 'Complete brand identity & visual package',
    category: 'branding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Logo Design Collection',
    description: 'Modern minimalist logo design exploration',
    category: 'branding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Corporate Branding',
    description: 'Full corporate identity systems',
    category: 'branding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542744094-3a31727223ec?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Packaging Design',
    description: 'Eco-friendly product packaging design',
    category: 'branding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Brand Guidelines',
    description: 'Comprehensive brand stylebook & guidelines',
    category: 'branding',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
  },
  
  // VIDEO PROJECTS
  {
    title: 'Corporate Commercial',
    description: 'Professional corporate video production',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    title: 'Product Showcase Reel',
    description: 'Dynamic product showcase video',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    title: 'Social Media Reel',
    description: 'Engaging vertical video campaign',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    title: 'Motion Graphics Animation',
    description: '2D & 3D animated motion graphics',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    title: 'Explainer Video',
    description: 'High-converting explainer animation',
    category: 'video',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  
  // WEB DESIGN PROJECTS
  {
    title: 'E-commerce Platform',
    description: 'Modern e-commerce store UI/UX',
    category: 'web',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Corporate Website UI',
    description: 'Professional corporate web design',
    category: 'web',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Portfolio Showcase',
    description: 'Creative agency portfolio design',
    category: 'web',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Landing Page System',
    description: 'High-converting SaaS landing page',
    category: 'web',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Mobile App Interface',
    description: 'iOS & Android mobile app UI design',
    category: 'web',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80'
  },
  
  // PHOTOGRAPHY PROJECTS
  {
    title: 'Product Photography',
    description: 'Professional studio product shoot',
    category: 'photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Corporate Event Shoot',
    description: 'Corporate annual event photography',
    category: 'photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Brand Photography',
    description: 'Lifestyle & commercial brand shoot',
    category: 'photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Executive Portraits',
    description: 'Professional headshots & portraits',
    category: 'photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Event Coverage',
    description: 'Full event documentation photography',
    category: 'photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
  },
  
  // SOCIAL MEDIA PROJECTS
  {
    title: 'Instagram Campaign',
    description: 'Social media campaign graphics',
    category: 'social',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Social Media Creatives',
    description: 'High-engagement social post graphics',
    category: 'social',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Content Strategy',
    description: 'Full monthly content calendar & posts',
    category: 'social',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Facebook Ads Suite',
    description: 'High-converting ad campaign graphics',
    category: 'social',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'LinkedIn Graphics',
    description: 'B2B LinkedIn post & carousel graphics',
    category: 'social',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'
  }
];
