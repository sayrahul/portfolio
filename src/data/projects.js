/**
 * Portfolio Projects Data Module
 * 
 * To scale to 500+ assets, simply add new project records to this array.
 * Each project should have:
 * - id: unique number or string
 * - title: project name
 * - category: "Web Design" | "Graphic Design" | "Video Editing"
 * - subcategory: sub-filter tag (e.g., "SaaS", "Retouching", "Reels", "Branding")
 * - thumbnail: card background image
 * - tools: array of strings of technologies used
 * - iconType: "web" | "design" | "video"
 * - (Optional) liveUrl: link for Web Design
 * - (Optional) beforeImage & afterImage: links for Graphic Design Before/After sliders
 * - (Optional) videoUrl & poster: links for Video Editing players
 */

export const PROJECTS = [
  {
    id: "web-saas-1",
    title: "SaaS Analytics Console",
    category: "Web Design",
    subcategory: "SaaS Systems",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    tools: ["Figma", "React", "Vanilla CSS", "Vite"],
    iconType: "web",
    liveUrl: "https://vercel.com"
  },
  {
    id: "graphic-retouch-1",
    title: "Corporate Portrait Retouching",
    category: "Graphic Design",
    subcategory: "Retouching",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=80",
    tools: ["Adobe Photoshop", "Lightroom"],
    iconType: "design",
    beforeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "video-reel-1",
    title: "Logistics Promotional Reel",
    category: "Video Editing",
    subcategory: "Promos & Reels",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"],
    iconType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "web-estate-1",
    title: "Luxury Real Estate Interface",
    category: "Web Design",
    subcategory: "Landing Pages",
    thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80",
    tools: ["Figma", "UI Design", "Responsive Layout"],
    iconType: "web",
    liveUrl: "https://github.com"
  },
  {
    id: "graphic-product-1",
    title: "Studio Product Retouching",
    category: "Graphic Design",
    subcategory: "Packaging & Print",
    thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80",
    tools: ["Photoshop", "Illustrator"],
    iconType: "design",
    beforeImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "web-ecom-1",
    title: "E-Commerce Footwear Layout",
    category: "Web Design",
    subcategory: "E-Commerce",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    tools: ["Figma", "UI Design", "Tailwind CSS"],
    iconType: "web",
    liveUrl: "https://example.com"
  },
  {
    id: "video-social-1",
    title: "App Promo Kinetic Typography",
    category: "Video Editing",
    subcategory: "Social Content",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    tools: ["After Effects", "DaVinci Resolve", "Sound Design"],
    iconType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "graphic-brand-1",
    title: "Hotel Branding Assets",
    category: "Graphic Design",
    subcategory: "Branding",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    tools: ["Illustrator", "Photoshop", "InDesign"],
    iconType: "design",
    beforeImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80"
  }
];
