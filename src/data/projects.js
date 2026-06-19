/**
 * Portfolio Projects Data Module
 * 
 * To scale to 500+ assets, simply add new project records to this array.
 * Each project should have:
 * - id: unique number or string
 * - title: project name
 * - category: "Web Design" | "Graphic Design" | "Video Editing"
 * - subcategory: sub-filter tag (e.g., "SaaS", "Retouching", "Reels", "Branding")
 * - shortDescription: card subtitle description
 * - thumbnail: card background image (e.g. Google Cloud Storage URL)
 * - details: paragraph describing the project
 * - tools: array of strings of technologies used
 * - iconType: "web" | "design" | "video" (dynamically rendered)
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
    shortDescription: "Interface design and front-end layout for a corporate business intelligence tool.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    details: "Designed and engineered the full landing experience and client dashboard console. Used clean typography, light grids, and structured navigation to maximize user efficiency.",
    tools: ["Figma", "React", "Vanilla CSS", "Vite"],
    iconType: "web",
    liveUrl: "https://vercel.com"
  },
  {
    id: "graphic-retouch-1",
    title: "Corporate Portrait Retouching",
    category: "Graphic Design",
    subcategory: "Retouching",
    shortDescription: "Advanced color grading and lighting manipulation for corporate marketing headshots.",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=80",
    details: "Adjusted skin tones, removed background clutter, and applied clean lighting overlays to align individual corporate photos with global brand standards.",
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
    shortDescription: "Corporate overview showcase video edited for an international supply chain group.",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    details: "Organized, cut, color-corrected, and sound-designed a promotional showcase highlighting global cargo operations. Features smooth lower thirds and custom data callout panels.",
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
    shortDescription: "Premium landing page wireframing and interactive UI design for luxury properties.",
    thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80",
    details: "Developed a modern search console and detailed layout grids focusing on clean borders, elegant brand imagery, and readable typography layouts for high-end buyers.",
    tools: ["Figma", "UI Design", "Responsive Layout"],
    iconType: "web",
    liveUrl: "https://github.com"
  },
  {
    id: "graphic-product-1",
    title: "Studio Product Retouching",
    category: "Graphic Design",
    subcategory: "Packaging & Print",
    shortDescription: "Product mockup editing, contrast adjustments, and text overlays for coffee packaging.",
    thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80",
    details: "Processed studio camera RAW files, adjusted highlight values, and integrated graphic designs onto physical packaging mockups for catalog delivery.",
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
    shortDescription: "Visual identity and checkout UI design for a high-performance athletic footwear brand.",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    details: "Built interactive catalog cards and modular design systems for products. Implemented color filter actions and rapid size-selectors.",
    tools: ["Figma", "UI Design", "Tailwind CSS"],
    iconType: "web",
    liveUrl: "https://example.com"
  },
  {
    id: "video-social-1",
    title: "App Promo Kinetic Typography",
    category: "Video Editing",
    subcategory: "Social Content",
    shortDescription: "Kinetic typography and graphic overlays editing for a mobile banking startup launch.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    details: "Designed fast-paced text motion graphics, customized sound soundscapes, and color-corrected mobile UI demo overlays for Instagram/TikTok campaigns.",
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
    shortDescription: "Corporate guidelines, logo geometry, and collateral layouts for a boutique luxury resort.",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    details: "Engineered corporate logo assets, customized corporate stationeries, and color retouched luxury rooms layout mockups for magazine prints.",
    tools: ["Illustrator", "Photoshop", "InDesign"],
    iconType: "design",
    beforeImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80"
  }
];
