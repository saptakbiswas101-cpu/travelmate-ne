// Verified High-Reliability Fallback Images & Inline SVG Data URIs
// Guarantees that no card ever displays a broken image icon.

export const FALLBACK_IMAGES = {
  Wildlife: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000&auto=format&fit=crop",
  Nature: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
  Cultural: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000&auto=format&fit=crop",
  Historical: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1000&auto=format&fit=crop",
  Spiritual: "https://images.unsplash.com/photo-1620619767323-b95a89183081?q=80&w=1000&auto=format&fit=crop",
  Adventure: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
  Offbeat: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
  Food: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop",
  Default: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop"
};

// SVG Placeholder Data URI (zero external network requirement)
const SVG_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23151319"/><path d="M0,350 Q200,200 400,320 T800,250 L800,500 L0,500 Z" fill="%2330213D"/><path d="M0,400 Q250,280 500,380 T800,340 L800,500 L0,500 Z" fill="%23201429"/><circle cx="650" cy="140" r="45" fill="%23D4AF37" opacity="0.8"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23DADCD3" font-family="sans-serif" font-size="24" font-weight="bold">TravelMateNE</text><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="%23A2B091" font-family="sans-serif" font-size="14">Explore Northeast India</text></svg>`;

export function handleImageError(e, category = 'Default') {
  e.target.onerror = null; // Prevent infinite loop
  const fallback = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.Default;
  // If the fallback also fails, use the inline SVG data URI
  e.target.onerror = () => {
    e.target.onerror = null;
    e.target.src = SVG_PLACEHOLDER;
  };
  e.target.src = fallback;
}
